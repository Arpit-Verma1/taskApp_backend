import express from "express";
import authRouter from "./routes/auth";

const app = express()

app.use(express.json()) //only forward json releated routes 
app.use("/auth", authRouter); 
//bind authrouter to our app


app.get("/", (req,res)=> {
    res.send("welcome to my app......")
})
app.listen(8000, () => {
    console.log("server started on port 8000")
})