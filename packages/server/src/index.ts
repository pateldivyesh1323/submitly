import express, { Request, Response } from "express";
import cors from "cors";
import environments from "./environments";
import userAuthenticationRoute from "./routes/user/authentication";
import formRoute from "./routes/form";
import apiKeyRoute from "./routes/formApiKey";
import formAnalyticsRoute from "./routes/formAnalytics";
import formSubmissionRoute from "./routes/formSubmission";
import { errorMiddleware } from "./middlewares/error-handler";
import connectDB from "./lib/db";
import rateLimit from "express-rate-limit";
import webhookRoute from "./routes/formWebhooks";
import formEmailRoute from "./routes/formEmails";
import { createServer } from "http";
import { Server } from "socket.io";
import setupSocketIO from "./sockets";

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer);

const PORT = environments.PORT;

// Database connection
connectDB();

// Form Rate Limiter
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 200, // Maximum 200 requests per IP address
  message: async (req: any, res: any) => {
    res.status(429).json({
      message: "Too many requests. Please try again later",
    });
  },
});

// Middlewares
app.use(limiter);
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));
app.use(cors({ origin: environments.ORIGIN_URI, credentials: true }));

// App Routes
app.use("/api/user/auth", userAuthenticationRoute);
app.use("/api/formApikey", apiKeyRoute);
app.use("/api/form/analytics", formAnalyticsRoute);
app.use("/api/form/webhooks", webhookRoute);
app.use("/api/form/emails", formEmailRoute);
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

// Socket setup
setupSocketIO(io);

httpServer.listen(PORT, () => {
  console.log(`🚀 Server is running on port https://localhost:${PORT}`);
});
