import express from "express";
import authRouter from "./routes/auth";
import taskRouter from "./routes/task";

const app = express()

app.use(express.json()) //only forward json releated routes 

//bind authrouter to our app
app.use("/auth", authRouter); 
app.use("/tasks",taskRouter);




app.listen(8000, () => {
    console.log("server started on port 8000")
})