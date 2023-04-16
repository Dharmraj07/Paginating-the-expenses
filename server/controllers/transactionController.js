const Transaction = require("../models/transaction");
const User = require("../models/users");
// Load environment variables from .env file
require("dotenv").config();
const { Op } = require("sequelize");
const { fn, col } = require("sequelize");

// Import required packages and models
const jwt = require("jsonwebtoken");
const Sequelize = require("sequelize");
const bcrypt = require("bcryptjs");
const sequelize = require("../config/sequelize");

function getTransactions(start, end, userId) {
  return Transaction.findAll({
    where: {
      userId,
      date: {
        [Op.gte]: start,
        [Op.lt]: end,
      },
    },
  });
}

const addTransaction = async (req, res) => {
  const t = await sequelize.transaction(); // Start a new transaction
  try {
    const userId = req.user.id;
    const { amount, description, date, category, type } = req.body;

    const transaction = await Transaction.create(
      {
        amount,
        description,
        date,
        category,
        type,
        userId,
      },
      { transaction: t }
    );
    console.log(type, amount);
    console.log(transaction);
    const user = await User.findByPk(userId, { transaction: t });
    if (type === "expense")
      await user.increment("totalExpense", { by: amount, transaction: t });
    else {
      await user.increment("totalIncome", { by: amount, transaction: t });
    }
    await t.commit(); // Commit the transaction if all the operations succeed

    res.status(201).json(transaction);
  } catch (error) {
    console.error(error);
    await t.rollback(); // Rollback the transaction if an error occurs
    res.status(500).json({ message: "Server error" });
  }
};

const getTransactionByUser = async (req, res) => {
  try {
    const userId = req.user.id;
    const transactionbyUser = await Transaction.findAll({
      where: {
        userId,
      },
    });

    res.json(transactionbyUser);
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
};



const getWeeklyTransactions = async (req, res) => {
  try {
    const userId = req.user.id;

    const today = new Date();
    const startOfWeek = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate() - today.getDay()
    );
    const endOfWeek = new Date(
      today.getFullYear(),
      today.getMonth(),
      startOfWeek.getDate() + 7
    );

    const transactions = await getTransactions(startOfWeek, endOfWeek, userId);

    res.json(transactions);
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
};

const getDailyTransaction = async (req, res) => {
  try {
    const userId = req.user.id;
    const today = new Date();
    const startOfDay = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate()
    );
    const endOfDay = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate() + 1
    );

    const transactions = await getTransactions(startOfDay, endOfDay, userId);

    res.json(transactions);
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
};


const getMonthlyTransaction=async (req,res)=>{
  try {
    const userId=req.user.id;
    const today = new Date();
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
  
    const transactions = await getTransactions(startOfMonth, endOfMonth,userId);
  
    res.json(transactions);
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
}

const getYearlyTransaction=async (req,res)=>{
  try {
    const userId=req.user.id;
    const today = new Date();
    const startOfYear = new Date(today.getFullYear(), 0, 1);
    const endOfYear = new Date(today.getFullYear(), 12, 0);
  
    const transactions = await getTransactions(startOfYear, endOfYear,userId);
  
    res.json(transactions);
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
}


const deleteTransaction=async (req,res)=>{
  try {
    const id=req.params.id;
    const transaction=await Transaction.findOne({
      where:{
        id
      }
    });
    if (!transaction) {
      throw new Error('Transaction not found');
  }
  await transaction.destroy();
  res.status(200).json({ message: 'Transaction deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
}

module.exports = {
  addTransaction,
  getTransactionByUser,
  getWeeklyTransactions,
  getDailyTransaction,
  getMonthlyTransaction,
  getYearlyTransaction,
  deleteTransaction
};
