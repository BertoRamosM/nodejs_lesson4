import { Router } from "express";
import { randomUUID } from "crypto";
import express, { json } from "express";
import fs from "node:fs";

const app = express();
app.use(json());

app.disable("x-powered-by");


app.use(json());


const ACCEPTED_ORIGINS = [
  "http://localhost:8080",
  "http://localhost:3000",
  "http://localhost:1234",
  //and production urls:
  "https://ourmoviesweb.com",
  //and any other website that we want to allow, we just need to get the origin from the request header
];

import {validateMovie, validatePartialMovie} from "../schemas/movieScheme"

import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
const movies = require(".movies.json");

const origin = req.header("origin");
if (ACCEPTED_ORIGINS.includes(origin) || !origin) {
  res.header("Access-Control-Allow-Origin", origin);
}

export const moviesRouter = Router();

moviesRouter.get("/", (req, res) => {
  const origin = req.header("origin");
  if (ACCEPTED_ORIGINS.includes(origin) || !origin) {
    res.header("Access-Control-Allow-Origin", origin);
  }

  const { genre } = req.query;
  if (genre) {
    const filteredMovies = movies.filter((movie) =>
      movie.genre.some((g) => g.toLowerCase() === genre.toLowerCase())
    );
    return res.json(filteredMovies);
  }
  res.json(movies);
});

moviesRouter.get("/:id", (req, res) => {
  const { id } = req.params;
  const movie = movies.find((movie) => movie.id === id);

  if (movie) {
    res.json(movie);
  } else {
    res.status(404).json({ error: "Movie not found" });
  }
});

moviesRouter.post("/", (req, res) => {
  const result = validateMovie(req.body);

  if (result.error) {
    return res.status(400).json({
      error: JSON.parse(result.error.message),
    });
  }

  const newMovie = {
    id: randomUUID(),
    ...result.data,
  };
  movies.push(newMovie);
  res.status(201).json(newMovie);
});


moviesRouter.delete("/:id", (req, res) => {
  const { id } = req.params;
  const movieIndex = movies.find((movie) => movie.id === id);
  if (movieIndex === -1) {
    return res.status(400).json({ message: "Movie not found" });
  }
  movies.splice(movieIndex, 1);
  return res.json({ message: "Movie deleted" });
});


moviesRouter.patch("/:id", (req, res) => {
  const result = validatePartialMovie(req.body);

  if (!result.success) {
    return res.status(400).json({ error: JSON.parse(result.error.message) });
  }

  const { id } = req.params;

  const movieIndex = movies.findIndex((movie) => movie.id === id);

  if (!movieIndex === -1)
    return res.status(404).json({ message: "Movie not found" });

  const updateMovie = {
    ...movies[movieIndex],
    ...result.data,
  };

  movies[movieIndex] = updateMovie;

  return res.json(updateMovie);
});

