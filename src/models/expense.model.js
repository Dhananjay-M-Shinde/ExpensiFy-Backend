import mongoose, { Schema } from "mongoose";

const expenseSchema = new mongoose.Schema(
    {
        day: String,
        time: String,
        date: String,
        category: String,
        amount: Number,
        user: {
            type: Schema.Types.ObjectId,
            ref: "User"
        }
    },
    {timestamps: true}
)

export const Expense = mongoose.model("Expense", expenseSchema);