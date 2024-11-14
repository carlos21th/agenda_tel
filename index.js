const express = require('express')
const cors = require('cors')
const app = express()
const morgan = require('morgan')
 
app.use(express.json()) //obtener datos que envia el usuario
app.use(cors())
app.use(express.static('dist'))
 
morgan.token('body', (req) => JSON.stringify(req.body))
app.use((req, res, next) => {
  const format = req.method === 'POST'
    ? ':method :url :status :res[content-length] - :response-time ms :body'
    : 'tiny';
  morgan(format)(req, res, next);
})
 
let persons = [
        {
            id: 1,
            name: "Adolfo",
            number: 993167474
        },
        {
            id: 2,
            name: "Jose",
            number: 99325764
        },
        {
            id: 3,
            name: "Lezama",
            number: 99336467474
        }
    ]
 
    app.get('/',(request,response) => {
        response.send('<h1>API REST FROM AGENDA</h1>')
    })
    app.get('/api/persons',(request,response) => {
        response.json(persons)
    })
    app.get('/api/persons/:id',(request,response) => {
        const id = Number(request.params.id)
        const person = persons.find(n => n.id === id)
        if(person) {
            response.json(person)
        }
        else {
            response.status(404).end()
        }
    })
    app.delete('/api/persons/:id',(request,response) => {
        const id = Number(request.params.id)
        //console.log('Delete id:',id);
        persons=persons.filter(n => n.id !== id)
        response.status(204).end()
    })
 
    const generateId = () => {
        const maxId = persons.length > 0
            ? Math.max(...persons.map(n => n.id))
            : 0
        return maxId + 1
    }
 
    app.post('/api/persons',(request,response) => { //agrega notas
        const body = request.body
        console.log(body)
        if (!body.name || !body.number) {
            return response.status(400).json({
                error: 'name or number missing'
            });
        }
        const person = {
            id: generateId(),
            name: body.name,
            number: body.number
        };
        persons = persons.concat(person)
        response.json(person)
    })
 
    app.put('/api/persons/:id', (request, response) => {
        const id = Number(request.params.id);
        const { name, number } = request.body;
    
        // Verificar que los campos 'name' y 'number' estén presentes en el cuerpo de la solicitud
        if (!name || !number) {
            return response.status(400).json({
                error: 'Falta el nombre o numero'
            });
        }
    
        // Buscar la persona por ID
        const personIndex = persons.findIndex(n => n.id === id);
    
        // Si no se encuentra la persona, retornar un error 404
        if (personIndex === -1) {
            return response.status(404).json({
                error: 'Persona no encontrada en agenda'
            });
        }
    
        // Crear un objeto con los datos actualizados
        const updatedPerson = {
            id: id,
            name: name || persons[personIndex].name,  // Actualizar 'name'
            number: number || persons[personIndex].number // Actualizar 'number'
        };
    
        // Reemplazar la persona existente en la lista
        persons[personIndex] = updatedPerson;
    
        // Enviar la respuesta con la persona actualizada
        response.json(updatedPerson);
    });
 
    const PORT = process.env.PORT || 3001
    app.listen(PORT, () => {
        //console.log(`Server express running on port ${PORT}`);
    })
    