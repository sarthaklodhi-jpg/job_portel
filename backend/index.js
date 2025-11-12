import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './utils/db.js'; 
import userRoutes from './routes/user.routes.js';
import companyRoutes from './routes/company.routes.js';
import jobRoutes from './routes/job.route.js';
import applicationRoutes from './routes/application.route.js';

dotenv.config({});

const app = express();

app.get('/home', (req, res) => {
return res.status(200).json({ message: 'Hello from the backend!',
    success: true
})

})

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

const corsOptions = {
    origin: 'http://localhost:5173',
    credentials: true,
}


app.use(cors(corsOptions));

app.use('/api/v1/users', userRoutes);
app.use('/api/v1/company', companyRoutes);
app.use('/api/v1/job', jobRoutes);
app.use('/api/v1/application', applicationRoutes);
/*/register	/api/v1/users/register
/login	/api/v1/users/login
/profile/update	/api/v1/users/profile/update*/

const port = process.env.PORT || 3000;
app.listen(port, () => {
    connectDB();
    console.log(`Server running on port ${port}`);
});