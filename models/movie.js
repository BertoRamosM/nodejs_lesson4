import { randomUUID } from "node:crypto";
import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
const movies = require("../movies.json");


//its good to be a class, because it has a contract, it will be very easy to type with typescript
export class MovieModel {
  //its important to make async, because if in the future we change the logic will still work for everything and not the specific we have now
  static getAll = async ({ genre }) => {
    if (genre) {
      const filteredMovies = movies.filter((movie) =>
        movie.genre.some((g) => g.toLowerCase() === genre.toLowerCase())
      );
      return res.json(filteredMovies);
    }
    return movies;
  }



  static async getById({ id }) {
    const movie = movies.find(movie => movie.id === id)
     return movie
  }

  static async create({input} ) {
    const newMovie = {
      id: randomUUID(),
      ...input
    }
    movies.push(newMovie)
    return newMovie
  }

  static async delete({ id }) {
    const movieIndex = movies.find((movie) => movie.id === id);
    if (movieIndex === -1) {
      return false
    }
    movies.splice(movieIndex, 1)
    return true
  }

  static async update({id, input }) {
    const movieIndex = movies.findIndex(movie => movie.id === id)
    if (movieIndex === -1) {
      return false
    }

    movies[movieIndex] = {
      ...movies[movieIndex],
      ...input
    }
    return movies[movieIndex]
  }
}