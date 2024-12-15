import { Router, Request, Response } from "express";
import { db } from "../db";
import { NewUser, users } from "../db/schema";
import { eq } from "drizzle-orm";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";

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
        res.status(500).json({ error: "internal server error." });
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
            return;
        }

        // check password is mathced
        const isMatch = await bcryptjs.compare(password, existingUser.password);
        if (!isMatch) {
            res.status(400).json({ msg: "Incorrect password" });
            return;
        }

        // share json web token to user persist login 
        const token = jwt.sign({ id: existingUser.id }, "paswordKey")

        res.json({ token, ...existingUser });
    } catch (e) {
        res.status(500).json({ error: "internal server error." });
    }
});


authRouter.post("/tokenIsValid", async (req, res) => {
    try {
        //get the header

        const token = req.header("x-auth-token");

        if (!token) {
            console.log("token");
            res.json(false);
            return;
        }

        // verify if token is valid
        const verified = jwt.verify(token, "paswordKey");


        if (!verified) {
            res.json(false);
            return;
        }
        // get the user data if the token is valid
        const verifiedToken = verified as { id: string };


        const [user] = await db.select().from(users).where(eq(users.id, verifiedToken.id))

        if (!user) {

            res.json(false)
            return;
        }
        res.json(true)


    }
    catch (e) {
        res.status(500).json(false)
    }
})

export default authRouter;
