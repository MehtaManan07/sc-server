import dotenv from "dotenv";
dotenv.config();

export const keys = {
	MONGO_URI: <string>process.env.MONGO_URI,
	APP_COOKIE: <string>process.env.APP_COOKIE,
	JWT_SECRET: <string>process.env.JWT_SECRET,
	NODE_ENV: <string>process.env.NODE_ENV,
	PORT: <string>process.env.PORT,
	ACCOUNT_SID: <string>process.env.ACCOUNT_SID,
	AUTH_TOKEN: <string>process.env.AUTH_TOKEN,
	FROM_TWILIO_PROD: <string>process.env.FROM_TWILIO_PROD,
	FROM_TWILIO_DEV: <string>process.env.FROM_TWILIO_DEV,
};
