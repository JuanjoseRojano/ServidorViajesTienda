import express from 'express'
import mongoose from 'mongoose'
import cors from "cors"

//NOTAS


//Consulta de dos cosas a la vez
// app.get('/api/Viajes/destino-salida', async (req, res) => {




// https://www.youtube.com/watch?v=_7UQPve99r4



// Búsqueda insensible a mayúsculas/minúsculas
//$regex es un operador del cual creo un objeto para pasarle mi string, mongoose es muy estricto
//con el tema de qué informacion pasamos y si contiene mayúsculas o tildes y caracteres raros por ende
//debemos provocar que las búsquedas sean insensibles para no comprometer las consultas o base de datos



const app = express()
app.use(express.json())

const port = process.env.PORT || 3000

//Cors me permite especificar que DOMINIO tiene acceso a realizar peticiones a mi servidor
app.use(cors(
    {
        origin: ['http://localhost:5173', 'http://127.0.0.1:5500', 'https://servidorviajesmitienda.onrender.com', 'http://localhost:3000', 'https://anepsa.vercel.app']
        ,
        methods: ['GET', 'POST', 'PUT', 'DELETE']
    }

))


//Esquemas de la base de datos
const VuelosSchema = mongoose.Schema(
    {

        destino: {
            type: String,
            default: "",
        },
        imagen: {
            type: [String],
            default: [],
        },
        salida: {
            type: [String],
            default: [],
        },
        horariosDeVuelo: {
            type: [String],
            default: [],
        },
        precio: {
            type: Number,
            default: 0,
        },
        numeroDeAsientosAvion: {
            type: Number,
            default: 0,
        },
        numeroDeAsientosRestantes: {
            type: Number,
            default: 0,
        }
    }
)


const VuelosUsuarioSchema = mongoose.Schema(
    {
        responsable: {
            type: [{
                nombre: String,
                apellido: String,
                fechaNac: String,
                DNIResponsable: String,
            }],
            default: [],
        },
        destino: {
            type: String,
            default: "",
        },
        imagen: {
            type: [String],
            default: [],
        },
        salida: {
            type: String,
            default: "",
        },
        horarioDeVuelo: {
            type: String,
            default: "",
        },
        fechaDeVuelo: {
            type: String,
            default: "",
        },
        precioDelVuelo: {
            type: Number,
            default: 0,
        },
        precioDelVueloFinal: {
            type: Number,
            default: 0,
        },
        numeroDeBilletes: {
            type: Number,
            default: 0,
        },
        idaYVuelta: {
            type: Boolean,
            default: false,
        }
    }
)


const UsuarioSchema = mongoose.Schema(
    {
        email: {
            type: String,
            default: ""
        },
        viajes: {
            type: [VuelosUsuarioSchema],
            default: [],
        }
    }
)





const Vuelo = mongoose.model("viajes", VuelosSchema)
const Usuario = mongoose.model("usuario", UsuarioSchema)
//Este creo que sobra
const VuelosUsuario = mongoose.model("vuelosUsuarioSchema", VuelosUsuarioSchema)


app.get('/', (req, res) => {
    res.send('Hello World')
    console.log(res)
})


//Obtener viajes
app.get('/api/Viajes', async (req, res) => {
    try {
        const datosViajes = await Vuelo.find({})
        res.status(200).json(datosViajes)
    } catch (error) {
        res.status(500).json({
            mensaje: error.mensaje
        })
    }
})

//Obtener usuarios
app.get('/api/Usuarios', async (req, res) => {
    try {
        const datosUsuarios = await Usuario.find({})
        res.status(200).json(datosUsuarios)
    } catch (error) {
        res.status(500).json({
            mensaje: error.mensaje
        })
    }
})

//Añadir viajes
app.post('/api/Viajes/add', async (req, res) => {
    try {
        const nuevoVuelo = await Vuelo.create(req.body)
        res.status(201).json(nuevoVuelo)
    } catch (error) {
        res.status(400).json({ message: "Error al crear producto", error: error.message })
    }
})

//Añadir usuarios
app.post('/api/Usuarios/add', async (req, res) => {
    try {
        const nuevoUsuario = await Usuario.create(req.body)
        res.status(201).json(nuevoUsuario)
    } catch (error) {
        res.status(400).json({ message: "Error al crear producto", error: error.message })
    }
})

//Añadir viaje al usuario
app.post('/api/Usuarios/add/:id/viajes', async (req, res) => {
    try {
        const { id } = req.params
        const nuevoViaje = req.body

        console.log("Recibido en backend:", nuevoViaje)

        const usuarioActualizado = await Usuario.findByIdAndUpdate(
            id,
            { $push: { viajes: nuevoViaje } },
            { new: true }
        )

        res.status(201).json(usuarioActualizado)
    } catch (error) {
        res.status(400).json({ message: "Error al agregar viaje al usuario", error: error.message })
    }
})




//Eliminar usuario
app.delete('/api/Usuarios/eliminar/:id', async (req, res) => {
    try {
        const { id } = req.params
        const usuarioEliminado = await Usuario.findByIdAndDelete(id)
        res.status(201).json(usuarioEliminado)
    } catch (error) {
        res.status(400).json({ message: "Error al crear producto", error: error.message })
    }
})

//Eliminar viajes
app.delete('/api/Viajes/eliminar/:id', async (req, res) => {
    try {
        const { id } = req.params
        const vueloEliminado = await Vuelo.findByIdAndDelete(id)
        res.status(201).json(vueloEliminado)
    } catch (error) {
        res.status(400).json({ message: "Error al crear producto", error: error.message })
    }
})





//A diferencia de mas abajo podemos utilizar operadores u  objetos como $pull
//$pull es algo que se supone hace mongodbatlas para eliminarlo sin embargo, al tratarse de un array con subdocumentos debo especificar el que se va a eliminar
//todos los documentos dentro de viajes con el id especificado se eliminaran

app.delete('/api/Usuarios/:id/viajes/:idVueloUsuario', async (req, res) => {
    try {
        const usuario = await Usuario.findByIdAndUpdate(
            req.params.id,
            { $pull: { viajes: { _id: req.params.idVueloUsuario } } },
            { new: true }
        )

        if (!usuario) {
            return res.status(404).json({ message: 'Usuario no encontrado' })
        }

        res.status(200).json({ message: 'Viaje eliminado', usuario })
    } catch (error) {
        res.status(400).json({ message: 'Error al eliminar viaje', error: error.message })
    }
})

//PUT infernal
app.put('/api/Usuarios/:id/viajes/:idVueloUsuario', async (req, res) => {
    try {
        const usuario = await Usuario.findOneAndUpdate(
            {
                _id: req.params.id,
                "viajes._id": req.params.idVueloUsuario
            },
            {
                $set: {
                    "viajes.$.salida": req.body.salida,
                    "viajes.$.horarioDeVuelo": req.body.horarioDeVuelo,
                    "viajes.$.fechaDeVuelo": req.body.fechaDeVuelo,
                    "viajes.$.precioDelVueloFinal": req.body.precioDelVueloFinal,
                    "viajes.$.numeroDeBilletes": req.body.numeroDeBilletes,
                    "viajes.$.idaYVuelta": req.body.idaYVuelta
                }
            },
            { new: true }
        )

        res.status(200).json({ message: 'Viaje actualizado', usuario })
    } catch (error) {
        res.status(400).json({ message: 'Error al actualizar viaje', error: error.message })
    }
})




//Actualizar vuelo tras comprar billete
app.put('/api/Viajes/:id', async (req, res) => {
    try {
        const vueloActualizado = await Vuelo.findByIdAndUpdate(req.params.id, req.body, { new: true })
        res.status(200).json(vueloActualizado)
    } catch (error) {
        res.status(400).json({ message: "Error al actualizar vuelo", error: error.message })
    }
})



//Buscamos usuario luego dentro de usuario su viaje finalmente cambiamos informacion
//No utilizo $set ya que esto reemplaza todo el contenido del subdocumento

app.put('/api/Usuarios/:id/viajes/:idVueloUsuario', async (req, res) => {
    try {
        const usuario = await Usuario.findById(req.params.id)



        // Busco en el array el viaje concreto por id
        const viaje = usuario.viajes.id(req.params.idVueloUsuario)


        // Recorro el viaje para qe asi se pueda actualizar cualquier cosa
        Object.keys(req.body).forEach(key => {
            viaje[key] = req.body[key]
        })

        // Con save permito que se guarden los cambios realizados puedo no puedo anidar con findbyidandupdate
        await usuario.save()

        res.status(200).json(usuario)
    } catch (error) {
        res.status(400).json({ message: "Error al actualizar viaje", error: error.message })
    }
})


mongoose.connect("mongodb+srv://jjanjor:qo5GsGaQ58DQWeV9@viajesbd.jjdaru7.mongodb.net/?retryWrites=true&w=majority&appName=ViajesBD")
    .then(() => {
        app.listen(port, () => {
            console.log("Server en 3000 y base de datos conectada")
        })
    })
    .catch(() => {
        console.log("Sin conexion")
    })
