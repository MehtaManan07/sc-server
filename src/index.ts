import express from "express";
import morgan from "morgan";
import "colors";
import cookieParser from "cookie-parser";

// import rateLimit from "express-rate-limit";
import database from "./config/database";
import userRoutes from "./routes/student";
import postRoutes from "./routes/post";
import communityRoutes from "./routes/community";
import commentRoutes from "./routes/comment";
import { keys } from "./config/keys";
import { errorHandler } from "./middlewares/errorHandler";
import ErrorResponse from "./middlewares/ErrorResponse";
import os from "os";

const app = express();
app.use(morgan("dev"));
// const limiter = rateLimit({
// 	max: 900,
// 	windowMs: 60 * 60 * 3600,
// 	message: "Too many requests from this IP, please try again in an hour",
// });

// app.use('/api',limiter)
app.use(express.json());
app.use(cookieParser());
database();

app.get("/", (req, res) => {
	res.json({ host: os.hostname() });
});
app.get("/api/v1/app/version", (req, res) => {
	return res.status(200).json({
		version: 21102021,
	});
});
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/posts", postRoutes);
app.use("/api/v1/comments", commentRoutes);
app.use("/api/v1/communities", communityRoutes);
app.all("*", (req, res, next) => {
	next(new ErrorResponse(` Can't find ${req.originalUrl} on this server`, 404));
});

app.use(errorHandler);
// @ts-ignore
// app.use(function (err, req, res, next) {
//   console.error(err.stack)
//   res.status(500).send('Something broke!')
// })
const port = keys.PORT || 80;
const server = app.listen(port, () => {
	console.log(
		`App running in ${keys.NODE_ENV} mode at http://localhost:${port}`.blue.bold
	);
});

process.on("unhandledRejection", (err) => {
	console.log("UNHANDLED REJECTION! 💥 Shutting down...".red);
	console.log(`${err}`.red);
	server.close(() => {
		process.exit(1);
	});
});

process.on("uncaughtException", (err) => {
	console.log("Uncaught Exception! 💥 Shutting down...".red);
	console.log(err);
});
