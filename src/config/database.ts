import mongoose from "mongoose";
import { keys } from "./keys";

const connectDB = () => {
	const databaseConnect = mongoose.connect(keys.MONGO_URI, {
		useNewUrlParser: true,
		useCreateIndex: true,
		useFindAndModify: false,
		useUnifiedTopology: true,
	});
	console.log(`mongodb connected: ${keys.MONGO_URI}`.cyan.underline);
};

export default connectDB;
