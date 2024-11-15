const mongoose = require('mongoose');
const express = require('express');
const app = express();
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
dotenv.config();

/******************************db connection************** */
const dbLink = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.98clx.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

mongoose.connect(dbLink)
    .then(function(connection){
        console.log('connected to db');
    }).catch(function(err){
        console.log(err)
    })

// middleware

app.use(express.json());
app.use(cookieParser());


/******************************auth methods and their routes****************** */
const authRouter = require('./Router/authRouter');
const userRouter = require('./Router/userRouter');
const movieRouter = require('./Router/movieRouter');

app.use('/api/auth', authRouter);
app.use('/api/user', userRouter);
app.use('/api/movie', movieRouter);



app.listen(3000, function(){
    console.log('Server started on port 3000');
})
