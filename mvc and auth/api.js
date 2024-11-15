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

/******************************routes and there handlers***************** */    
const {createUser, getAllUser, getUser, deleteUser} = require('./userController');
const userModel = require('./userModel');

app.use(express.json());
app.use(cookieParser());


/******************************auth methods and their routes****************** */
const jwt = require('jsonwebtoken');
const util = require('util');
const promisify = util.promisify;
const promisifiedJwtSign = promisify(jwt.sign);
const promisifiedJwtVerify = promisify(jwt.verify);


// handler function
async function signupHandler(req,resp){
try{
    const userObject = req.body;
    if(!userObject.email || !userObject.password){
        return resp.status(400).json({
            message: 'required data missing',
            status: 'failure'
        })
    }
    const user = await userModel.findOne({email: userObject.email});
    if (user){
        return resp.status(400).json({
            message: 'user already loagged In',
            status: 'failure'
        })
    }
    const newUser = await userModel.create(userObject);
    resp.status(201).json({
        message: 'new user created',
        user: newUser,
        status: 'failure'
    })
}catch(err){
    console.log('err', err);
    resp.status(500).json({
        message: err.message,
        status: 'failure'
    })
}
}

async function loginHandler(req,resp){
    try{
        const {email,password} = req.body;
        const user = await userModel.findOne({email});
        if (!user){
            return resp.status(400).json({
                message: 'unauthorized user',
                status: 'failure'
            })
        }
        const areEqual = password == user.password;
        if(!areEqual){
            return resp.status(400).json({
                message: 'Invalid username or password',
                status: 'failure'
            })
        }
         // token create
         const authToken = await promisifiedJwtSign({id: user['_id']}, process.env.secretkey);
         resp.cookie('jwt', authToken,({
            maxAge: 1000*60*60*24,
            httpOnly: true
         }))
         resp.status(200).json({
            message: 'user loggedIn successfuly',
            status: 'successful'
         })
    }catch(err){    
        console.log('err', err);
        resp.status(500).json({
            message: err.message,
            status: 'failure'
        })
    }
}

async function protectRouteMiddleware(req,resp,next){
    try{
        const token = req.cookie.jwt;
        if(!token){
            return resp.status(400).json({
                message: 'unauthorized user',
                status:'failure'
            })
        }
        const decryptedToken = await promisifiedJwtVerify(token, process.env.secretkey);
        req.id = decryptedToken.id;
        next();
    }catch(err){
        console.log('err', err);
        resp.status(500).json({
            message: err.message,
             status: 'failure'
        })
        
    }
}

async function isAdminMiddleware(req,resp,next){
    const id = req.id;
    const user = await userModel.findById(id);
    if (user.role!= 'admin'){
        resp.status(400).json({
            message: 'you are not an admin',
            status: 'failure'
        })
    }
    next();
}

async function profileHandler(req,resp){
    try{
        const id = req.id;
        const user = userModel.findById(id);
        if (!user){
            return resp.status(404).json({
                message: 'Invalid user',
                status: 'failure'
            })
        }
        resp.json({
            message: 'profile worked',
            status: 'success',
            user: user
        })
    }catch(err){
        console.log('err', err);
        resp.status(500).json({
            message: err.message,
            status: 'failure plz login'
        })
    }
}

async function logoutHandler(req,resp){
    try{
        resp.clearCookie('jwt', {path: '/'});
        resp.json({
            message: 'logout successfully',
            status: 'success'
        })
    }catch(err){
        console.log('err',err)
        resp.status(500).json({
            message: err.message,
            status: 'failure'
        })
    }
}

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
