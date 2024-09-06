import express, { Request, Response } from "express";
import cors from "cors";
import environments from "./environments";

const app = express();
const PORT = environments.PORT;

app.use(cors, express.json({ limit: "50mb" }));

app.get("/", (req: Request, res: Response) => {
  res.status(200).json({ message: "Server status good" });
});

app.all("*", (req: Request, res: Response) => {
  res.status(404).json({ message: "Route not found" });
});

app.listen(PORT, () => {
  console.log(`Server is running on port https://localhost:${PORT}`);
});
