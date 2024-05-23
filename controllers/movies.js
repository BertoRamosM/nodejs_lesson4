import { MovieModel } from "../models/movie.js";
import { validateMovie, validatePartialMovie } from "../schemas/movieScheme.js";

const require = createRequire(import.meta.url);

import express, { json } from "express";

const app = express();
app.use(json());

app.disable("x-powered-by");

app.use(json());

import { createRequire } from "node:module";

//the controller decides whats get rendered or given, in this case "res.json(movies)", the return the movies data
export class MovieController {
  static async getAll(req, res) {
    const { genre } = req.query;
    const movies = await MovieModel.getAll({ genre })
    res.json(movies);
  }

  static async getById(req, res) {
    const { id } = req.params;
    const movie = await MovieModel.getById(id)
  
    if (movie) {
      res.json(movie);
    } else {
      res.status(404).json({ error: "Movie not found" });
    }
  }


  static async create(req, res) {
  const result = validateMovie(req.body);

  if (result.error) {
    return res.status(400).json({
      error: JSON.parse(result.error.message),
    });
  }
  const newMovie = await MovieModel.create({ input: result.data })

  res.status(201).json(newMovie);
  }
  

  static async delete(req, res) {
  const { id } = req.params;

  const result = await MovieModel.delete({id})
  const movieIndex = movies.find((movie) => movie.id === id);
  if (result === false) {
    return res.status(400).json({ message: "Movie not found" });
  }

  return res.json({ message: "Movie deleted" });
  }
  
  static async update(req, res) {
  const result = validatePartialMovie(req.body);

  if (!result.success) {
    return res.status(400).json({ error: JSON.parse(result.error.message) });
  }

  const { id } = req.params;

  const updatedMovie = await MovieModel.update({id, input : result.data})

  return res.json(updatedMovie);
}







}