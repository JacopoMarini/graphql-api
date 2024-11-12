import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import morgan from "morgan";
import helmet from "helmet";
import mongoose, { Error } from "mongoose";
import { graphqlHTTP } from "express-graphql";
import schema from "schema/index.js";

const app = express();

dotenv.config();

app.use(morgan("common"));

app.use(
  cors({
    origin: ["*"],
    credentials: true,
  })
);

app.use(
  helmet({
    contentSecurityPolicy:
      process.env.NODE_ENV === "production" ? undefined : false,
  })
);

app.use(express.json());

mongoose
  .connect(process.env.MONGODB_URL)
  .then(() => {
    console.log("Database connected successfully");
  })
  .catch((err: Error) => console.log(err));

app.use(
  "/graphql",
  graphqlHTTP({
    schema,
    graphiql: true,
  })
);

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`server running in port: ${PORT}`);
});

export default app;
