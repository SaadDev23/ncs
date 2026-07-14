import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import helmet from "helmet";
import morgan from "morgan";
import multer from "multer";
import path from "path";
import dotenv from "dotenv";
import axios from "axios";
import { fileURLToPath } from "url";
import connect from "./database/conn.js";
import router from "./router/route.js";
import userRoutes from "./router/users.js";
import postRoutes from "./router/posts.js";
import { register } from "./controllers/appController.js";
import { verifyToken } from "./middleware/auth.js";
import { createPost } from "./controllers/posts.js";
import session from "express-session";
import cookieParser from "cookie-parser";
// import { CreatPost } from '../client/src/components/CreatPost';

/** CONFIGURATIONS */
const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config();

app.use(cookieParser());

app.use(
  session({
    secret: "superSecret",
    saveUninitialized: true,
    resave: true,
  }),
);

const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:3001",
  "https://ncs-iota.vercel.app",
  "https://ncs-git-main-neo-code-syndicate.vercel.app",
  ...(process.env.CLIENT_URLS || "")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean),
];

const corsOptions = {
  origin(origin, callback) {
    // Requests without an Origin header are server-to-server/health checks.
    if (!origin || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    return callback(new Error(`Origin ${origin} is not allowed by CORS`));
  },
  credentials: true,
};
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(morgan("common"));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(cors(corsOptions));
app.use("/assets", express.static(path.join(__dirname, "public/assets")));

/** File Storage */
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/assets");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

/** middlewares */
app.use(express.json());
app.disable("x-powered-by"); //less hackers know about our stack

const port = process.env.PORT || 8080;

/** HTTP GET Request */
app.get("/", (req, res) => {
  res.send("Welcome to NEO CODE SYNDICATE PORTAL");
});
const upload = multer({ storage });

/** Routes with files */
app.post("auth/register", upload.single("picture"), register);
app.post("/posts", verifyToken, upload.single("picture"), createPost);

/** Proxy route for Codeforces API — Karachi top 10 */
app.get("/api/codeforces-rankings", async (req, res) => {
  try {
    console.log("Fetching Codeforces rankings...");
    const response = await axios.get(
      "https://codeforces.com/api/user.ratedList?activeOnly=false",
    );

    const data = response.data;
    console.log("Codeforces API response status:", data.status);

    if (data.status === "OK") {
      if (!data.result || !Array.isArray(data.result)) {
        console.error("Invalid data structure from Codeforces API");
        return res.status(500).json({
          status: "FAILED",
          comment: "Invalid data structure from Codeforces API",
        });
      }

      const karachiUsers = data.result.filter(
        (user) => user.country === "Pakistan" && user.city === "Karachi",
      );
      console.log(`Found ${karachiUsers.length} users from Karachi, Pakistan`);

      const top10 = karachiUsers.slice(0, 10);
      res.json({ status: "OK", result: top10 });
    } else {
      console.error("Codeforces API error:", data.comment);
      res.status(500).json({
        status: "FAILED",
        comment: data.comment || "Failed to fetch Codeforces data",
      });
    }
  } catch (error) {
    console.error("Error in codeforces-rankings endpoint:", error.message);
    res.status(500).json({
      status: "FAILED",
      comment: error.message || "Internal server error",
    });
  }
});

/** API Routes */
app.use("/api", router);
app.use("/users", userRoutes);
app.use("/posts", postRoutes);

/** Start Server - After Db connection */
connect()
  .then(() => {
    try {
      app.listen(port, () => {
        console.log(`Server connected to http://localhost:${port}`);
      });
    } catch (error) {
      console.log("Cannot connect to the database");
    }
  })
  .catch((error) => {
    console.log("Invalid Database Connection");
  });
