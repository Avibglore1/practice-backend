const express = require('express');
const authRouter = express.Router();

const { loginHandler, signupHandler, logoutHandler, protectRouteMiddleware, profileHandler,
} = require("../Controller/authController");

authRouter
    .post("/login", loginHandler)
    .post("/signup", signupHandler)
    .get("/logout", logoutHandler)
    .get("/profile", protectRouteMiddleware, profileHandler);

module.exports=authRouter;