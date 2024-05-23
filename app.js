
import express, { json } from 'express'
import { moviesRouter } from './routes/movies.js';
import { corsMiddleware } from './middleware/cors.js';



const app = express()
app.use(corsMiddleware({}));
app.use(json())

app.disable('x-powered-by')

app.use('/movies', moviesRouter)


const PORT = process.env.PORT ?? 1234

app.listen(PORT, () => {
  console.log(`Server listening in port http://localhost:${PORT}`)
})


/* 
MVC = model vista controler

archtecture patron in web and mobile
it provides an structure to separate our app in 3 different parts:
MODEL, VISTA and CONTROLER 

MODEL => {
  represents the logic of the business, data structure, acces db, update information, integrity of the data, 
}
 

VISTA =>{
  represents the UI the user will be using, present data, send actions...
}


CONTROLER=>{
  its the middleware between VISTA  and MODEL, repsonds to the user, check the new entries, to tell the MODEL what operations we require
}

model sends the data to the controller and the controller to the vista, then the user can send actions using the vista, that will be send to the controller so it can ask the model for the new data required, and the model will send the data


VISTA could be react, json(its a way of represent the data that its recovered by the controller from the model), 

CONTROLLER

MODEL could be MySQL, local, mongoDb etc..it can be connected to many different places to access the data

with this structure we could change a part of our application without affecting the other. Example, tomorrow we change react for vue and the MODEL and CONTROLLER will not be affected by this change
*/
