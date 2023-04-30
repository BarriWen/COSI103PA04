const express = require("express");
const router = express.Router();
const Transaction = require("../models/Transaction");

isLoggedIn = (req, res, next) => {
  if (res.locals.loggedIn) {
    next();
  } else {
    res.redirect("/login");
  }
};

router.get("/transactions/", isLoggedIn, async (req, res) => {
  let transactions;
  if (req.query.groupBy == "category") {
    transactions = await Transaction.aggregate([
      {
        $group: {
          _id: "$category",
          total: { $sum: "$amount" },
        },
      },
    ]);
    res.render("groupByCat", { transactions });
  } else {
    if (req.query.sortBy == "category") {
      transactions = await Transaction.find({ userId: req.user._id }).sort({
        category: 1,
      });
    } else if (req.query.sortBy == "amount") {
      transactions = await Transaction.find({ userId: req.user._id }).sort({
        amount: 1,
      });
    } else if (req.query.sortBy == "description") {
      transactions = await Transaction.find({ userId: req.user._id }).sort({
        description: 1,
      });
    } else if (req.query.sortBy == "date") {
      transactions = await Transaction.find({ userId: req.user._id }).sort({
        date: 1,
      });
    } else {
      transactions = await Transaction.find({ userId: req.user._id });
    }
    res.render("transactions", { transactions });
  }
});

router.post("/transactions", isLoggedIn, async (req, res) => {
  const newTransaction = new Transaction({
    description: req.body.description,
    amount: req.body.amount,
    category: req.body.category,
    date: req.body.date,
    userId: req.user._id,
  });
  await newTransaction.save();
  res.redirect("/transactions");
});

router.get(
  "/transactions/delete/:transactionId",
  isLoggedIn,
  async (req, res) => {
    await Transaction.deleteOne({ _id: req.params.transactionId });
    res.redirect("/transactions");
  }
);

router.get(
  "/transactions/edit/:transactionId",
  isLoggedIn,
  async (req, res) => {
    const transaction = await Transaction.findById(req.params.transactionId);
    res.render("editTransactions", { transaction });
  }
);

router.post("/transactions/edit", isLoggedIn, async (req, res) => {
  const { description, amount, category, date, transactionId } = req.body;
  await Transaction.findOneAndUpdate(
    { _id: transactionId },
    { $set: { description, amount, category, date } }
  );
  res.redirect("/transactions");
});

module.exports = router;
