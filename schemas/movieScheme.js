import z from "zod"

const movieSchema = z.object({
  title: z.string({
    invalid_type_error: "Movie title must be a string",
    required_error: "Title requiered",
  }),
  year: z.number().int().positive().min(1900).max(2025),
  director: z.string(),
  duration: z.number().int(),
  rate: z.number().min(0).max(10).default(5,5),
  poster: z.string().url({
    message: "Poser must be a valid URL",
  }),
  genre: z.array(
    z.enum([
      "Action",
      "Adventure",
      "Comedy",
      "Drama",
      "Fantasy",
      "Horror",
      "Thriller",
      "Sci-Fi",
      "Crime",
    ]),
    {
      required_error: "Movie genre is requires",
      invalid_type_error: "Movie genre must be an array of enum Genre",
    }
  ),
});

export function validateMovie(object) {
  return movieSchema.safeParse(object);
}

export function validatePartialMovie(object) {
  return movieSchema.partial().safeParse(object)
}


