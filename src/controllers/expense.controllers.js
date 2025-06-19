import {asyncHandler} from "../utils/asyncHandler.js";
import {apiError} from "../utils/apiError.js";
import {Expense} from "../models/expense.model.js";
import { apiResponse } from "../utils/apiResponse.js";

const getExpenses = asyncHandler(async(req, res) =>{
    try {
        console.log("into expense controller");
        const user = req.user._id
        const expenses = await Expense.find({user}).sort({ date: 1 });
        // console.log(expenses);
        return res
            .status(200)
            .json(new apiResponse(200, expenses, "expenses retrieved successfully"))
    } catch (error) {
        return res 
        .status(500)
        .json(new apiError(500, error.message))
    }
})

const addExpense = asyncHandler(async(req, res) =>{
    try {
        const {day, time, date, category, amount} = req.body;
        const user = req.user._id;
        const addexpense = await Expense.create({day, time, date, category, amount, user});
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
        const _id = req.params.id; // Get ID from URL parameter
        const {day, time, date, category, amount} = req.body;
        console.log("Update request body:", req.body);
        console.log("User ID:", req.user._id);
        console.log("Expense ID to update:", _id);
        
        if (!_id) {
            throw new apiError(400, "Expense ID is required");
        }

        const expenseData = {
            day: day,
            time: time,
            date: date,
            category: category,
            amount: amount
        };

        // Find and update expense that belongs to the authenticated user
        const updatedExpenseEntry = await Expense.findOneAndUpdate(
            { _id: _id, user: req.user._id }, // Filter by both expense ID and user ID
            expenseData,
            { new: true }
        );

        if(!updatedExpenseEntry){
            throw new apiError(404, "Expense entry not found or you don't have permission to update it");
        }
        
        console.log("Updated expense:", updatedExpenseEntry);
        return res
            .status(200)
            .json(new apiResponse(200, updatedExpenseEntry, "expense entry updated successfully"))
    } catch (error) {
        console.log("Update expense error:", error);
        res
        .status(error.statusCode || 500)
        .json({statusCode: error.statusCode, error:{message: error.message || "something went wrong"}})
    }
})

const getDaywiseExpenses = asyncHandler(async(req, res) =>{
    try {
        console.log("Getting daywise expenses");
        const user = req.user._id;
        
        // Get expenses for the current month or specified date range
        const { startDate, endDate } = req.query;
        
        let dateFilter = { user };
        
        if (startDate && endDate) {
            dateFilter.date = {
                $gte: startDate,
                $lte: endDate
            };
        } else {
            // Default to current month if no date range specified
            const now = new Date();
            const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
            const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);
            
            dateFilter.date = {
                $gte: firstDay.toISOString().split('T')[0],
                $lte: lastDay.toISOString().split('T')[0]
            };
        }

        const expenses = await Expense.find(dateFilter).sort({ date: 1 });
        
        // Group expenses by date and calculate daily totals
        const daywiseData = expenses.reduce((acc, expense) => {
            const date = expense.date;
            if (!acc[date]) {
                acc[date] = {
                    date: date,
                    day: expense.day,
                    total: 0,
                    count: 0,
                    expenses: []
                };
            }
            acc[date].total += expense.amount;
            acc[date].count += 1;
            acc[date].expenses.push({
                category: expense.category,
                amount: expense.amount,
                time: expense.time
            });
            return acc;
        }, {});

        // Convert to array and sort by date
        const result = Object.values(daywiseData).sort((a, b) => new Date(a.date) - new Date(b.date));

        return res
            .status(200)
            .json(new apiResponse(200, result, "daywise expenses retrieved successfully"))
    } catch (error) {
        console.log("Error getting daywise expenses:", error);
        return res 
        .status(500)
        .json(new apiError(500, error.message))
    }
})

export {getExpenses, addExpense, deleteExpense, updateExpense, getDaywiseExpenses}