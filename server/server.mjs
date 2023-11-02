
import dotenv from "dotenv";
import mongoose from "mongoose";
//import records from "./routes/record.mjs";
import app from "./app.mjs"

dotenv.config();

const PORT = process.env.PORT;

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    //listen for express
    app.listen(PORT, () => {
      console.log("connected to DB, listening on port", PORT);
    });
  })
  .catch((error) => {
    console.log(error);
  });
