// here we have migrated from commonJS from course 3 to ESModules, we also have to migrate the type of project in the package.json =>
//"type": "commonjs", to "type": "module",
//we then click the ... under the first "required" and we tap "ctrl + ." and we import automatically
import express, { json } from 'express'

import fs from 'node:fs';

//we have to declare to nodejs using ESModules that this file its a JSON!!!
//BUTTT THIS SYNTAX ITS DEPRECATED!!!
/* import movies from './movies.json' assert {type : 'json'} */

//thats the first correct way of doing it for this project:
/* 
const movies = JSON.parse(fs.readFileSync('./movies.json', 'utf-8')) 
*/

//this is a better way to read JSON in ESModules recommended for now, by creating a method require
import { createRequire } from 'node:module';
//Here, createRequire is called with import.meta.url, which is a URL string representing the location of the current module. This creates a require function that can be used within this module as if it were a CommonJS module.
const require = createRequire(import.meta.url)
const movies = require("./movies.json")


//crypto its for creating news "id"
import { randomUUID } from 'crypto'

//zod its for data valudastion
import { validateMovie, validatePartialMovie } from './schemas/movieScheme.js'

const app = express()

//the middleware of express to validate the body of the request
app.use(json())

app.disable('x-powered-by')

//an endpoint its a path where we have an available resource
//all the resourses that are movies, we identify them with /movies


//it exists also a "npm install cors -E" that help us with cors

/* then...
const cors = required = ('cors)
app.use(cors())

but attention, this cors will accept any request by default
 */

const ACCEPTED_ORIGINS = [
  "http://localhost:8080",
  "http://localhost:3000",
  "http://localhost:1234",
  //and production urls:
  "https://ourmoviesweb.com",
  //and any other website that we want to allow, we just need to get the origin from the request header
]

//in the query we can pass any params from the url thanks to express
app.get("/movies", (req, res) => {
  //here we can use '*' or the specific origin that we want to allow, like the https://localhost:8080 or we can create a list like above
  //this cors validation only works with basic methods GET/HEAD/POST
/*   
and for complex methods such as PUT/PATCH/DELETE
we have to use the CORS PRE-Flight
that requieres a propery called OPTIONS

 */  const origin = req.header('origin')
  if (ACCEPTED_ORIGINS.includes(origin) || !origin) {
     res.header("Access-Control-Allow-Origin", origin)
  }
  //remember if we make a request to ourselves, the header will not contain the origin
 
  const { genre } = req.query
  if (genre) {
    const filteredMovies = movies.filter(movie => movie.genre.some(g => g.toLowerCase() === genre.toLowerCase())
    )
    return res.json(filteredMovies)
  }
  res.json(movies);
});

//path-to-regexp library
app.get('/movies/:id', (req, res) => {
  const { id } = req.params
  const movie = movies.find(movie => movie.id === id)
   
  if (movie) {
    res.json(movie);
  } else {
    res.status(404).json({ error: "Movie not found" });
  }
})

//create new movies, as every resource its identified with an url we use simply "/movies" and then the method defines the operation
app.post('/movies', (req, res) => {


  //we validate the request with a schema from zod
  //the best way to do this its to create a new folder called schema and store them all there
  const result = validateMovie(req.body)

  if (result.error) {
    return res.status(400).json({
      error: JSON.parse(result.error.message)
    })
  }


  //later on we will pass this object to the db
  //we create the new object
  const newMovie = {
    //to add an id, we use crypto from nodejs
    //universal unique identifier
    id: randomUUID(),
    ...result.data
    /* 
    title,
    genre,
    year,
    director,
    duration,
    rate: rate ?? 0,
    poster 
    */
  }

  //we require a validation library for this data something executed in runtime, like ZOD.dev

  //this is not rest because we are saving the estate of the application in memory!!!!!!!!
  //instead we should add it to a db
  movies.push(newMovie)

  //201 means new resource created
  //we return the new object created to update the clients cache
  res.status(201).json(newMovie)
})


//update a movie property
app.patch('/movies/:id', (req, res) => {
  
  const result = validatePartialMovie(req.body)

  if (!result.success) {
    return res.status(400).json({ error: JSON.parse(result.error.message)})
  }

    const { id } = req.params;

  
  //in this case we use the index to verify if it exists and to later works on it
  const movieIndex = movies.findIndex(movie => movie.id === id)

  //index-1 means the movie dosnt exists 
  if (!movieIndex === -1) return res.status(404).json({ message: 'Movie not found' })
  
  const updateMovie = {
    ...movies[movieIndex],
    ...result.data
  }

  movies[movieIndex] = updateMovie

  return res.json(updateMovie)
})

app.delete('/movies/:id', (req, res) => {
  
  const { id } = req.params
  const movieIndex = movies.find(movie => movie.id === id)
  if (movieIndex === -1) {
    return res.status(400).json({message: 'Movie not found'})
  }
  movies.splice(movieIndex, 1)
  return res.json({message:'Movie deleted'})
})

//this is what its requiered for the cors of delete
app.options('/movies', (req, res) => {
  const origin = req.header('origin')
  if (ACCEPTED_ORIGINS.includes(origin) || !origin) {
    res.header("Access-Control-Allow-Origin", origin)
    res.header('Access-Control-Allow-Methods', 'GET,POST, PATCH, DELETE')
  }
  res.send(200)
})


//its important to always add the option of the env viariable, and always in MAJ
const PORT = process.env.PORT ?? 1234

app.listen(PORT, () => {
  console.log(`Server listening in port http://localhost:${PORT}`)
})

/* 
  REST: Software Architecture => (escalability, portability, simplicity, visibility, fiability, easy to modify)
  
  =>Resourses: in REST everything is a resource (user, post, image .... ) or a collection of it. 

  !!!Every resource its identified by an URL!!!

  =>Methods(verbs HTTP(get, post, put, delete,    patch ... ))
  To define the operations we can do with the resources 
  The basic CRUD (create, read, update and delete)


  =>Representation of the resource: its not tie to be a json, it can be html, xml etc...

  =>Stateless, every request that we pass to the server has to provide all the necessary information to understand the request. SO the server cannot keep state between requests. 
  The server dosnt need to store or keep information to know what the user wants with the next request
  So its the client who needs to send all the information to make the server process the request (url, pagination, ...)


  =>Uniform UI: all of our url has to be the same structure, and do the same thing (/pokemon/pickachu === /pokemon/charmander)


  => Separation of concepts: The components of the client and dthe server are separated. Allow the client and the server to grow independently
*/
/* 
DIFFERENCIES between POST, PUT and PATCH

"Idempotency": its the property of doing the same single action many times and even like that we get the same result that we will get by doing it only once

POST: create a new resource in the server(/movies)
=>NOT idempotent, as we always create a new resource. If we send an item that exists already it will create AGAIN

PUT: update an existing resourse or create if already exists(/movies/123-456-789)
=>YES idempotent, even if we do the same request several time to the same resource we always get the same result


PATCH: Update PARTIALLY a resources (/movies/123-456-789)
=>IT CAN BE idempotent 
*/