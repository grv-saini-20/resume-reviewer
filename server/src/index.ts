import  express  from "express";
import cors from "cors";
import dotenv from 'dotenv';
import reviewRouter from "./routes/reviewRouter";
import { errorHandler, notFound } from "./middlewares/errorMiddleware";

dotenv.config();

const PORT = 3001;
const app = express();

app.use(cors({origin: "http://localhost:5173"}));
app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use("/api/review", reviewRouter);

app.use(notFound);
app.use(errorHandler);

app.listen(PORT, () => {
    console.log(`app is running on PORT ${PORT}`);
})

export default app;