import { Router } from "express";
import express, { json } from "express";

const app = express();
app.use(json());

app.disable("x-powered-by");


app.use(json());



import { createRequire } from "node:module";
import { MovieController } from "../controllers/movies.js";
const require = createRequire(import.meta.url);
const movies = require("../movies.json");


//best case scenario as we are using async await we should wrap every path in a try catch for error handling, the best thing will be creating a middleware for it

export const moviesRouter = Router();

moviesRouter.get("/", MovieController.getAll);

moviesRouter.get("/:id", MovieController.getById);

moviesRouter.post("/", MovieController.create);

moviesRouter.delete("/:id", MovieController.delete);

moviesRouter.patch ("/:id", MovieController.update);

