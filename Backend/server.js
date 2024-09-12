import cors from "cors";
import express from "express";
import { connectDB } from "./config/db.js";
import userRouter from "./routes/userRoute.js";
import courseRouter from "./routes/courseRoute.js";
import 'dotenv/config';
import http from "http";
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';



// App Config
const app = express();
const port = process.env.PORT || 8080; // Use environment variable for port if available

app.use(bodyParser.json({ limit: '500mb' }));  // Adjust the limit according to your needs
app.use(bodyParser.urlencoded({ limit: '500mb',parameterLimit:100000, extended: true }));

// Middleware
app.use(express.json());
app.use(cookieParser());

app.use(cors({
  origin: ['http://localhost:3000', 'https://skill-voyage-onrq.vercel.app'], // Allow both local and deployed frontend
  credentials: true, // Allow credentials (cookies, authorization headers, etc.)
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  allowedHeaders: 'Content-Type,Authorization'
}));

app.options('*', cors()); // Handle preflight requests

// DB connection with error handling
connectDB().catch(error => {
  console.error("DB Connection Error: ", error);
  process.exit(1);
});

// API endpoints
app.use("/api/user", userRouter);
app.use("/api/course", courseRouter);
app.use("/images", express.static('uploads'));

app.get("/", (req, res) => {
  res.send("API Working");
});

// Error Handling Middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke in middleware!');
});

const server = http.createServer(app);
app.listen(port, () => {
  console.log(`Server started on http://localhost:${port}`);
});

export default app;