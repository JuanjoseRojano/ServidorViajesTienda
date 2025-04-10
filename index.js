import express from 'express'
import mongoose from 'mongoose'
import cors from "cors"

//NOTAS


//Consulta de dos cosas a la vez
// app.get('/api/Viajes/destino-salida', async (req, res) => {



// Con req.query puedo recuperar info del lado cliente
// const { destino, salida } = req.query;  // Accedemos a los parámetros de la URL



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
        origin: ['http://localhost:5173', 'http://127.0.0.1:5500', 'https://servidorviajesmitienda.onrender.com'],
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
        diasDeLaSemana: {
            type: [String],
            default: [],
        },
        precio: {
            type: Number,
            default: 0,
        },
        numeroAsientosAvion: {
            type: Number,
            default: 0,
        }
    }
)



const UsuarioSchema = mongoose.Schema(
    {
        nombreUsuario: {
            type: String,
            default: "",
        },
        email: {
            type: String,
            default: ""
        },
        viajes: {
            type: [String],
            default: [],
        }
    }
)


const Vuelo = mongoose.model("viajes", VuelosSchema)
const Usuario = mongoose.model("usuario", UsuarioSchema)


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
});

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
});

//Obtener viajes por destino
app.get('/api/Viajes/destino/:destino', async (req, res) => {
    try {
        const { destino } = req.params
        const datosViajes = await Vuelo.find({
            destino: { $regex: new RegExp(destino, 'i') }
        })
        res.status(200).json(datosViajes)
    } catch (error) {
        res.status(500).json({
            mensaje: error.mensaje
        })
    }
});


//Obtener viajes por salida
app.get('/api/Viajes/salida/:salida', async (req, res) => {
    try {
        const { salida } = req.params
        const datosViajes = await Vuelo.find({
            salida: { $regex: new RegExp(salida, 'i') }
        })
        res.status(200).json(datosViajes)
    } catch (error) {
        res.status(500).json({
            mensaje: error.mensaje
        })
    }
});



//Añadir viajes
app.post('/api/Viajes/add', async (req, res) => {
    try {
        const nuevoVuelo = await Vuelo.create(req.body);
        res.status(201).json(nuevoVuelo);
    } catch (error) {
        res.status(400).json({ message: "Error al crear producto", error: error.message });
    }
})

//Añadir usuarios
app.post('/api/Usuarios/add', async (req, res) => {
    try {
        const nuevoUsuario = await Usuario.create(req.body);
        res.status(201).json(nuevoUsuario);
    } catch (error) {
        res.status(400).json({ message: "Error al crear producto", error: error.message });
    }
})




//Eliminar usuario
app.delete('/api/Usuarios/eliminar/:id', async (req, res) => {
    try {
        const { id } = req.params
        const usuarioEliminado = await Usuario.findByIdAndDelete(id)
        res.status(201).json(usuarioEliminado);
    } catch (error) {
        res.status(400).json({ message: "Error al crear producto", error: error.message });
    }
});

//Eliminar viajes
app.delete('/api/Viajes/eliminar/:id', async (req, res) => {
    try {
        const { id } = req.params
        const vueloEliminado = await Vuelo.findByIdAndDelete(id)
        res.status(201).json(vueloEliminado);
    } catch (error) {
        res.status(400).json({ message: "Error al crear producto", error: error.message });
    }
});




mongoose.connect("mongodb+srv://jjanjor:qo5GsGaQ58DQWeV9@viajesbd.jjdaru7.mongodb.net/?retryWrites=true&w=majority&appName=ViajesBD")
    .then(() => {
        app.listen(port, () => {
            console.log("Server en 3000 y base de datos conectada")
        })
    })
    .catch(() => {
        console.log("Sin conexion")
    })
