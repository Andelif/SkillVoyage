import cors from "cors";
import express from "express";
import { connectDB } from "./config/db.js";
import userRouter from "./routes/userRoute.js";
import 'dotenv/config';
import http from "http";

// App Config
const app = express();
const port = process.env.PORT ; // Use environment variable for port if available

// Middleware
app.use(express.json());
app.use(cors());

// DB connection with error handling
connectDB().catch(error => {
  console.error("DB Connection Error: ", error);
  process.exit(1);
});

// API endpoints
app.use("/api/user", userRouter);

app.get("/", (req, res) => {
  res.send("API Working");
});

// Error Handling Middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke in middleware!');
});

const server = http.createServer(app);
server.listen(port, () => {
  console.log(`Server started on http://localhost:${port}`);
});

export default app;