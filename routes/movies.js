import { Router } from "express";
import { randomUUID } from "crypto";
import express, { json } from "express";
import fs from "node:fs";

const app = express();
app.use(json());

app.disable("x-powered-by");


app.use(json());


import {validateMovie, validatePartialMovie} from "../schemas/movieScheme.js"

import { createRequire } from "node:module";
import { MovieModel } from "../models/movie.js";
const require = createRequire(import.meta.url);
const movies = require("../movies.json");



export const moviesRouter = Router();

moviesRouter.get("/", async (req, res) => {
  const { genre } = req.query;
  const movies = await MovieModel.getAll({genre})
  res.json(movies);
});

moviesRouter.get("/:id", async (req, res) => {
  const { id } = req.params;
  const movie = await MovieModel.getById(id)
  
  if (movie) {
    res.json(movie);
  } else {
    res.status(404).json({ error: "Movie not found" });
  }
});

moviesRouter.post("/", async (req, res) => {
  const result = validateMovie(req.body);

  if (result.error) {
    return res.status(400).json({
      error: JSON.parse(result.error.message),
    });
  }
  const newMovie = await MovieModel.create({ input: result.data })

  res.status(201).json(newMovie);
});


moviesRouter.delete("/:id", async (req, res) => {
  const { id } = req.params;

  const result = await MovieModel.delete({id})
  const movieIndex = movies.find((movie) => movie.id === id);
  if (result === false) {
    return res.status(400).json({ message: "Movie not found" });
  }

  return res.json({ message: "Movie deleted" });
});


moviesRouter.patch ("/:id", async (req, res) => {
  const result = validatePartialMovie(req.body);

  if (!result.success) {
    return res.status(400).json({ error: JSON.parse(result.error.message) });
  }

  const { id } = req.params;

  const updatedMovie = await MovieModel.update({id, input : result.data})

  return res.json(updatedMovie);
});

