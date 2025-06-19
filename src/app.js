import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';

const app = express();

app.use(cors())

app.use(express.json({limit:"50mb"}))
app.use(express.urlencoded({extended: true, limit: "50mb"}))
app.use(express.static("public"))
app.use("/upload", express.static('public/temp'))
app.use("/uploads", express.static('public/uploads'))
app.use(cookieParser())


// routes import

import userRouter from "./routes/user.routes.js"
import expenseRouter from "./routes/expense.routes.js"


// routes declaration
// http://localhost:8000/api/v1/users/register
app.use("/api/v1/users", userRouter);
app.use("/api/v1/expenses", expenseRouter);


export {app}
