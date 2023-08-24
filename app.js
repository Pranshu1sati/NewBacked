const express = require("express");
const dotenv = require("dotenv").config();
const mongoose = require('mongoose');
const Router = require("./Router")
const { ErrorHandlerMiddleware } = require("./Midleware/ErrorHandlerMiddleware")
const { enablePassportJwtStrategy } = require("./Utility/enablePassportJwtStrategy")
const passport = require("passport")
const cors = require("cors");
const port = process.env.PORT;
const app = express();

app.use(cors());
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(passport.initialize())
enablePassportJwtStrategy(passport)
app.use(Router)
app.use(ErrorHandlerMiddleware)

main().catch(err => console.log(err));

async function main() {
  await mongoose.set("strictQuery", false).set('strictPopulate', false).connect(process.env.DB_URL)
    .then(() => {
      console.log("Connected to database");
    });

  // use `await mongoose.connect('mongodb://user:password@127.0.0.1:27017/test');` if your database has auth enabled
}
app.listen(port, () => {
  console.log("listening on port " + port);
})