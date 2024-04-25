import {asyncHandler} from "../utils/asyncHandler.js";
import {apiError} from "../utils/apiError.js";
import {Expense} from "../models/expense.model.js";
import { apiResponse } from "../utils/apiResponse.js";

const getExpenses = asyncHandler(async(req, res) =>{
    try {
        console.log("into expnese controller");
        const user = req.user.id
        const expneses = await Expense.find({user}).sort({ date: 1 });
        // console.log(expneses);
    return res
            .status(200)
            .json(new apiResponse(200, expneses, "expenses retrieved successfully"))
    } catch (error) {
        return res 
        .status(500)
        .json(new apiError(500, error.message))
    }
})

const addExpense = asyncHandler(async(req, res) =>{
    try {
        const {day, time, date, category, amount} = req.body;
        const user = req.user.id;
        const addexpense = await Expense.insertMany({day, time, date, category, amount, user});
        // const expense = new Expense({day, time, date, category, amount, user});
        // await expense.save();
        console.log(addexpense);
        return res
            .status(200)
            .json(new apiResponse(200, addexpense, "expense added successfully"))
    } catch (error) {
        return res 
        .status(500)
        .json(new apiError(500, error.message))
    }
})

const deleteExpense = asyncHandler(async(req, res) =>{
    try {
        // const expense = await Expense.findById(req.params.id);
        console.log(req.params.id);
        const id = req.params.id;

        const expenseDeleted = await Expense.findByIdAndDelete(id)
        if (!expenseDeleted) {
            throw new apiError(401, "expense entry not found")
        }
        console.log(expenseDeleted);
        return res
            .status(200)
            .json(new apiResponse(200, expenseDeleted, "expense entry deleted"))
    } catch (error) {
        console.log(error);
        res
        .status(error.statusCode || 500)
        .json({statusCode: error.statusCode, error:{message: error.message || "something went wrong"}})
    }
})

const updateExpense = asyncHandler(async(req, res) =>{
    try {
        const {_id, day, time, date, category, amount} = req.body;
        console.log(req.body);
        const expenseData = {
            _id: req.body._id,
            day: day,
            time: time,
            date: date,
            category: category,
            amount: amount
          };
        const updatedExpenseEntry = await Expense.findByIdAndUpdate(
            { _id: _id },
            expenseData,
            { new: true }
        )
        if(!updatedExpenseEntry){
            throw new apiError(401, "expense entry not found")
        }
        console.log(updatedExpenseEntry, "this is");
        return res
            .status(200)
            .json(new apiResponse(200, updatedExpenseEntry, "expense entry updated successfully"))
    } catch (error) {
        console.log(error);
        res
        .status(error.statusCode || 500)
        .json({statusCode: error.statusCode, error:{message: error.message || "something went wrong"}})
    }
})

export {getExpenses, addExpense, deleteExpense, updateExpense}