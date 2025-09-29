import express, { json } from "express";
import db from "./config/dbConnect.js";
import buyerRoute from "./routes/buyerRoutes.js";
import sellerRoute from "./routes/sellerRoutes.js";
import bookRoute from "./routes/bookRoutes.js";
import authRoute from "./routes/authRoutes.js";
import logger from "morgan";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import cors from "cors";
import path from 'path';
import { fileURLToPath } from 'url';


const app = express();

// Make uploads folder publicly accessible
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


app.use(cors({
  origin: ['http://localhost:3000',
    'book-store-react-jade.vercel.app'
  ], 
  credentials: true
}));


app.use(json());
db();
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(morgan('dev'));
app.use(express.static(path.join(__dirname, 'public')));




app.use("/api/buyer", buyerRoute);
app.use("/api/seller", sellerRoute);
app.use("/api/books", bookRoute);
app.use("/api/auth", authRoute);

app.listen(4000);