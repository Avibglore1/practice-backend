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
const authRouter = require('');
const userRouter = require('');
const movieRouter = require('');

app.use('/api/auth', authRouter);
app.use('/api/user', userRouter);
app.use('/api/movie', movieRouter);

/**********************************remove below lines********** */



// handler function


app.post("/login", loginHandler);
app.post("/signup", signupHandler);

app.get("/logout", logoutHandler)

app.get("/profile", protectRouteMiddleware, profileHandler)
// user handler function 
app.post("/user", createUser)
app.get("/user", protectRouteMiddleware, isAdminMiddleware, getAllUser);
app.get("/user/:id", getUser);
app.delete("/user/:id", protectRouteMiddleware, deleteUser);

app.listen(3000, function(){
    console.log('Server started on port 3000');
})
