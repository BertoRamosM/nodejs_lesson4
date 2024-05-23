
import express, { json } from 'express'
import { moviesRouter } from './routes/movies.js';
import { corsMiddleware } from './middleware/cors.js';



const app = express()
app.use(corsMiddleware());
app.use(json())
app.disable('x-powered-by')

app.use('/movies', moviesRouter)


const PORT = process.env.PORT ?? 1234

app.listen(PORT, () => {
  console.log(`Server listening in port http://localhost:${PORT}`)
})
