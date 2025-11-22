
import cookieParser from "cookie-parser";
import cors from "cors";
import express, { Request, Response } from "express";


import { globalErrorHandler } from "./middlewares/globalErrorHandler";
import notFound from "./middlewares/notFound";
import { router } from "./router";


// app.use(expressSession({
//     secret: envVars.EXPRESS_SESSION_SECRET,
//     resave: false,
//     saveUninitialized: false
// }))

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: "https://task-tonic-client.vercel.app",
    credentials: true,
  })
);
app.use(cookieParser());

app.use("/api/v1", router)

app.get("/", (req: Request, res: Response) => {
    res.status(200).json({
        message: "Welcome to TaskTonic System Backend"
    })
})


app.use(globalErrorHandler)

app.use(notFound)

export default app