import express from 'express';
import connectToDb from './config/db.js';
import route from './routes/usersRoute.js';

const app = express();
const port = 80;
app.use(express.json());

app.use("/api",route);

connectToDb();

app.listen(port,()=>{
    console.log(`server is runnig on http:localhost:${port}`);
})