import dotenv from "dotenv";
import express from "express";
import cookieParser from "cookie-parser";
import CharRouter from "./routes/char.router.js";
import ItemsRouter from "./routes/items.route.js";
import UsersRouter from "./routes/users.router.js";
import ErrorHandlingMiddleware from './middlewares/error-handling.middleware.js';

// .env 파일을 읽어서 process.env에 추가합니다.
dotenv.config();

const app = express();
const PORT = 3018;

app.use(express.json());
app.use(cookieParser());
app.use("/api", [UsersRouter, CharRouter,ItemsRouter]);
app.use(ErrorHandlingMiddleware);

app.listen(PORT, () => {
  console.log(PORT, "포트로 서버가 열렸어요!");
});


