import express from "express";
import authRouter from "./routes/auth";

const app = express()

app.use(express.json()) //only forward json releated routes 

//bind authrouter to our app
app.use("/auth", authRouter); 




app.listen(8000, () => {
    console.log("server started on port 8000")
})