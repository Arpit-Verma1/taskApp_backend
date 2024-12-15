import { Router, Request, Response } from "express";
import { db } from "../db";
import { NewUser, users } from "../db/schema";
import { eq } from "drizzle-orm";
import bcryptjs from "bcryptjs";

const authRouter = Router();

interface SignupBody {
    name: string;
    email: string;
    password: string;
}


interface LoginBody {
    name: string;
    email: string;
    password: string;
}

authRouter.post("/signup", async (req: Request<{}, {}, SignupBody>, res: Response) => {
    try {
        // Get request body
        console.log(req.body)
        const { name, email, password } = req.body;

        // Check if user already exists
        console.log(name);
        const existingUser = await db.select().from(users).where(eq(users.email, email));
        if (existingUser.length) {
            res.status(400).json({ msg: "User with the same email already exists!" });
        }
        console.log("hasing password");

        // Hash the password
        const hashedPassword = await bcryptjs.hash(password, 8);
        const newUser: NewUser = {
            name,
            email,
            password: hashedPassword,
        };

        // Insert new user into the database and return the created user
        const [user] = await db.insert(users).values(newUser).returning();
        console.log(user)
        res.status(201).json(user);
    } catch (e) {
        res.status(500).json({ error:"internal server error."});
    }
});


authRouter.post("/login", async (req: Request<{}, {}, LoginBody>, res: Response) => {
    try {
        // Get request body
        console.log(req.body)
        const { email, password } = req.body;

        // Check if user already exists
        const [existingUser] = await db.select().from(users).where(eq(users.email, email));
        if (!existingUser) {
            res.status(400).json({ msg: "User with this email does not exists!" });
            return ;
        }

        // Hash the password
        const isMatch = await bcryptjs.compare(password, existingUser.password);
        if(!isMatch) {
            res.status(400).json({msg : "Incorrect password"});
            return ;
        }
         res.json(existingUser);
    } catch (e) {
        res.status(500).json({ error:"internal server error."});
    }
});





authRouter.get("/me", (req: Request, res: Response) => {
    res.send("Hi from auth");
});

export default authRouter;
