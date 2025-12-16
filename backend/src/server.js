import express from "express";
import "dotenv/config.js";
import { ENV } from "./lib/env.js";
import cookieParser from 'cookie-parser';
import AuthRouter from "./router/auth_router.js";
import cors from 'cors';
import { ConnectDB } from "./lib/db.js";


const app = express();
const PORT = ENV.PORT || 5000;


app.use(express.json());
app.use(cors({origin : ENV.CLIENT_URL , credentials : true}));
app.use(cookieParser());


app.use("/api/auth" , AuthRouter);






app.listen(PORT, () => {
    console.log("Server is running on http://localhost:" + PORT);
    ConnectDB();
})