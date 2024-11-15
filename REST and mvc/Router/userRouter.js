const express = require('express');
const userRouter = express.Router();
const { createUser, getAllUser, getUser, deleteUser } = require("../Controller/userController");
const { protectRouteMiddleware, isAdminMiddleware } = require('../Controller/authController');

userRouter
    .post("/", createUser)
    .get("/", protectRouteMiddleware, isAdminMiddleware, getAllUser)
    .get("/:id", getUser)
    .delete("/:id", protectRouteMiddleware, deleteUser);

module.exports = userRouter;