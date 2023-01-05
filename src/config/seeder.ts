import fs from "fs";
import mongoose from "mongoose";
import "colors";
import { keys } from "./keys";

import { Community } from "../models/Community";
import { Student } from "../models/Student";
import { Post } from "../models/Post";
mongoose
  .connect(keys.MONGO_URI, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then((a) => console.log("connected".bgBlue, a))
  .catch((err) => console.log("duh" + "\n" + err));

// const products = JSON.parse(fs.readFileSync("./products.json", "utf-8"));
// import to db
const importData = async () => {
  try {
    const t1 = new Date().getSeconds();
    // await Student.create(products);
    console.log("Data imported".bgGreen);
    const t2 = new Date().getSeconds();
    console.log(t2,t1,t2 - t1);
    process.exit(0);
  } catch (error) {
    console.error("Error:\n", error);
    process.exit(1);
  }
};
// remove from db
const deleteData = async () => {
  try {
    const t1 = new Date().getSeconds();
    // await Student.deleteMany();
    await Post.deleteMany();
    await Community.deleteMany();
    console.log("Data deleted".bgRed);
    const t2 = new Date().getSeconds();
    console.log(t2,t1,t2 - t1);
    process.exit(0);
  } catch (error) {
    console.error("Error:\n", error);
    process.exit(1);
  }
};
if (process.argv[2] === "-i") {
  importData();
} else if (process.argv[2] === "-d") {
  deleteData();
} else if(process.argv[2] === '-s'){
  const s = async () => {
    let l = await Student.find({},{ 'firebaseToken': 1, 'firstName': 1 })
    let f = l.filter((t: any) => t.firebaseToken !== '')
    console.log({ l: l.length, f })
  }
  s()
}
