import  express  from "express";
import cors from "cors";
import dotenv from 'dotenv';

dotenv.config();

const PORT = 3001;
const app = express();

app.use(cors({origin: "http://localhost:5173"}));
app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.listen(PORT, () => {
    console.log(`app is running on PORT ${PORT}`);
})

export default app;