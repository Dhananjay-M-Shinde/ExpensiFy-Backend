import {Router} from "express";
import { verifyJWT } from "../middlewares/auth.middlewares.js";
import { getExpenses, addExpense, deleteExpense, updateExpense } from "../controllers/expense.controllers.js";

const expenseRouter = Router();

expenseRouter.route("/get-expenses").get(verifyJWT, getExpenses)

expenseRouter.route("/add-expense").post(verifyJWT, addExpense)

expenseRouter.route("/delete-expense/:id").delete(verifyJWT, deleteExpense)

expenseRouter.route("/update-expense").put(verifyJWT, updateExpense)

export default expenseRouter;
