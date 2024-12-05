require ('dotenv').config()

const express = require('express')
const cors = require('cors')
const app = express()
const Contact = require('./models/contacto.js')

app.use(express.json()) //obtener datos que envia el usuario
app.use(cors()) //para poder pedir o enviar datos desde otros servidores diferentes al alojados
app.use(express.static('dist'))


//Mildware-------------------------------------------------------------------------
const morgan = require('morgan')
morgan.token('body', (req) => JSON.stringify(req.body))
app.use((req, res, next) => {
  const format = req.method === 'POST'
    ? ':method :url :status :res[content-length] - :response-time ms :body'
    : 'tiny';
  morgan(format)(req, res, next);
})
//-----------------------------------------------------------------------------------

let persons = [
        {
        id: 1,
        name: "Jose Alberto",
        number: 9931798565
        },
        {
            id: 2,
            name: "Adolfo",
            number: 9933225858
        },
        {
            id: 3,
            name: "Carlos",
            number: 9931307185
        }
    ]
 
    app.get('/',(request,response) => {
        response.send('<h1>API REST FROM AGENDA</h1>')
    })
    app.get('/api/persons',(request,response) => {
        Contact.find({}).then(persons =>{
            response.json(persons)
            })
    })
    app.get('/api/persons/:id',(request,response) => {
        Contact.findById(request.params.id)
        .then (person =>{
            if(person) {
                response.json(person)
            }
            else {
                response.status(404).end()
            }
        })
        .catch (error => {
            console.log(error);
            response.status(400).send({error:'malformated: id'})
        })
    })
    app.delete('/api/persons/:id',(request,response) => {
        Contact.findByIdAndDelete(request.params.id)
        .then(() => {
            response.status(204).end(); // Devuelve una respuesta sin contenido (No Content)
        })
        .catch(error => {
            console.error(error);
            response.status(400).send({ error: 'malformated: id' });
        })
    })
 
    app.post('/api/persons',(request,response) => { //agrega notas
        const body = request.body
        console.log(body)
        if (!body.name || !body.number) {
            console.log("error post")
            return response.status(400).json({
                error: 'nombre o numero faltante'
            });
        }
        const person = new Contact ({
            name: body.name,
            number: body.number
        });
        person.save().then(result => response.json(person))
    })
 
    app.put('/api/persons/:id', (request, response) => {
        const body = request.body;
    
        // Verificar que los campos 'name' y 'number' estén presentes en el cuerpo de la solicitud
        if (!body.name || !body.number) {
            console.log("Error put")
            return response.status(400).json({
                error: 'Falta el nombre o numero'
            });
        }
        // Crear un objeto con los datos actualizados
        const person = {
            name: body.name,
            number: body.number 
        }
        Contact.findByIdAndUpdate(request.params.id,person,{new:true})
            .then(result => {
                response.json(result)
            })
    })

 
    const PORT = process.env.PORT
    app.listen(PORT, () => {
        //console.log(`Server express running on port ${PORT}`);
    })
    