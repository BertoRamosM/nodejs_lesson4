import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
const movies = require("../movies.json");


//its good to be a class, because it has a contract, it will be very easy to type with typescript
export class MovieModel {
  static getAll({ genre }) {
    if (genre) {
      const filteredMovies = movies.filter((movie) =>
        movie.genre.some((g) => g.toLowerCase() === genre.toLowerCase())
      );
      return res.json(filteredMovies);
    }
    return movies;
  }
}
