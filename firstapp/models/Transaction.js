"use strict";
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

var transactionSchema = Schema({
  description: String,
  amount: Number,
  category: String,
  date: Date,
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
});

module.exports = mongoose.model("Transaction", transactionSchema);
