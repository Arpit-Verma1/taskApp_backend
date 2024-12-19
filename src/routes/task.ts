import { Router } from "express"
import { auth, AuthRequest } from "../middleware/auth";
import { NewTask, tasks } from "../db/schema";
import { db } from "../db";
import { eq } from "drizzle-orm";
const taskRouter = Router();

export default taskRouter;


taskRouter.post("/", auth, async (req: AuthRequest, res) => {
    //    const { title, description, hexColor, dueAt } = req.body;
    try {
        console.log(req.body); // Log the incoming request body for debugging

        // Ensure dueAt is a valid Date object
        const { dueAt, ...rest } = req.body;
        const parsedDueAt = dueAt ? new Date(dueAt) : null;

        if (parsedDueAt && isNaN(parsedDueAt.getTime())) {
            throw new Error('Invalid dueAt date format');
        }

        // Add UUID and parsed dueAt to the request body
        req.body = { ...rest, dueAt: parsedDueAt, uuid: req.user };

        // Cast to NewTask type
        const newTask: NewTask = req.body;

        // Insert into the database
        const [task] = await db.insert(tasks).values(newTask).returning();

        res.status(201).json(task);
    } catch (e) {
        console.log(e);
        res.status(500).json({ error: e })
    }
})



taskRouter.get("/", auth, async (req: AuthRequest, res) => {
    try {


        const allTasks = await db.select().from(tasks).where(eq(tasks.uuid, req.user!))

        res.json(allTasks);

    } catch (e) {
        res.status(500).json({ error: e })
    }
})


taskRouter.delete("/", auth, async (req: AuthRequest, res) => {
    try {


        const { taskId }: { taskId: string } = req.body;
        await db.delete(tasks).where(eq(tasks.id, taskId))

        res.json(true);

    } catch (e) {
        res.status(500).json({ error: e })
    }
})