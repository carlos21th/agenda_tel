const mongoose = require('mongoose');
const url= process.env.MONGODB_URI

mongoose.set('strictQuery',false)
console.log('Conectando a mongo DB...',url)
mongoose.connect(url)
    .then(result => {
        console.log('Conectado correctamente a Mongo DB');
    })
    .catch(error => {
        console.log('Error al conectarse a Mongo DB',error.message);
    })

const contactSchema = new mongoose.Schema({
    name: { type: String, required: true },
    number: { type: String, required: true },
});
       
contactSchema.set('toJSON', {
    transform:(document, returnedObject)=>{
        returnedObject.id=returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject._v
    }
})
module.exports = mongoose.model('Contact', contactSchema)