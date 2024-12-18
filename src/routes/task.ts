import { Router } from "express"
import { auth , AuthRequest } from "../middleware/auth";
import {  NewTask, tasks } from "../db/schema";
import { db } from "../db";
import { eq } from "drizzle-orm";
const taskRouter = Router();

export default taskRouter;


taskRouter.post("/", auth,async(req: AuthRequest, res)=> {
    try {
        console.log(req.body);
        //create a new task in db
        req.body = {...req.body, uuid: req.user};
        
        const newTask : NewTask = req.body;
        const [task] = await db.insert(tasks).values(newTask).returning();

        res .status(201).json(task);

    }catch  (e) {
        res.status(500).json({error :e})
    }
})



taskRouter.get("/", auth,async(req: AuthRequest, res)=> {
    try {
        
    
        const allTasks = await db.select().from(tasks).where(eq(tasks.uuid, req.user!))

        res.json(allTasks);

    }catch  (e) {
        res.status(500).json({error :e})
    }
})


taskRouter.delete("/", auth,async(req: AuthRequest, res)=> {
    try {
        
    
        const {taskId} : {taskId :string} = req.body;
        await db.delete(tasks).where(eq(tasks.id , taskId))

        res.json(true);

    }catch  (e) {
        res.status(500).json({error :e})
    }
})