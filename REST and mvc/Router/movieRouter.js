const express = require('express');
const movieRouter = express.Router();
const { createMovie, deleteMovie, getAllMovie, getMovie } = require("../Controller/movieController.js");
const { protectRouteMiddleware, isAdminMiddleware } = require('../Controller/authController.js');

movieRouter
    .post("/", createMovie).
    get("/api/movie", protectRouteMiddleware, isAdminMiddleware, getAllMovie)
    .get("/api/movie/:id", getMovie).
    delete("/api/movie/:id", protectRouteMiddleware, deleteMovie);

module.exports = movieRouter;