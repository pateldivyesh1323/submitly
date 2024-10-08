import express, { Request, Response } from "express";
import cors from "cors";
import environments from "./environments";
import userAuthenticationRoute from "./routes/user/authentication";
import formRoute from "./routes/form";
import apiKeyRoute from "./routes/formApiKey";
import formSubmissionRoute from "./routes/formSubmission";
import { errorMiddleware } from "./middlewares/error-handler";
import connectDB from "./lib/db";

const app = express();
const PORT = environments.PORT;

// Database connection
connectDB();

// Middlewares
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));
app.use(cors({ origin: environments.ORIGIN_URI, credentials: true }));

// App Routes
app.use("/api/user/auth", userAuthenticationRoute);
app.use("/api/formApikey", apiKeyRoute);
app.use("/api/form", formRoute);
app.get("/", (req: Request, res: Response) => {
  res.status(200).json({ message: "Server status good" });
});
// Form submission route
app.use("/form/submit", formSubmissionRoute);

app.all("*", (req: Request, res: Response) => {
  res.status(404).json({ message: "Route not found" });
});

// Error handler
app.use(errorMiddleware);

app.listen(PORT, () => {
  console.log(`Server is running on port https://localhost:${PORT}`);
});
