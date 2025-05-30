import express, { Application } from "express";
import ItemRoutes from "./src/routes/item.routes";
import { errorHandler } from "./src/middleware/errorHandler";

const app: Application = express();

app.use(express.json());

app.use("/items", ItemRoutes);

app.get("/", (req, res) => {
  res.send("Welcome!");
});

app.use((req, res) => {
  res.status(404).json({ error: "Not found." });
});

app.use(errorHandler);

app.listen(3000, () => {
  console.log("Listening on port 3000");
});
