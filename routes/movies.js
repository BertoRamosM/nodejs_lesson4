import { Router } from "express";

import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
const movies = require("./movies.json");

const router = Router()

router.get('/', (req, res) => {
  
  const origin = req.header('origin')
  if (ACCEPTED_ORIGINS.includes(origin) || !origin) {
    res.header("Access-Control-Allow-Origin", origin)
  }

  const { genre } = req.query;
  if (genre) {
    const filteredMovies = movies.filter((movie) =>
      movie.genre.some((g) => g.toLowerCase() === genre.toLowerCase())
    );
    return res.json(filteredMovies);
  }
  res.json(movies);
})

router.get('/:id', (req, res) => {
    const { id } = req.params;
    const movie = movies.find((movie) => movie.id === id);

    if (movie) {
      res.json(movie);
    } else {
      res.status(404).json({ error: "Movie not found" });
    }
})