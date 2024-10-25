import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv';
dotenv.config()
const PORT = process.env.PORT
import db from '../node/database/db.js'
import proyectoRoutes from '../node/routes/routes.js'

const app = express()


app.use(cors())
app.use(express.json())
app.use('/', proyectoRoutes)


try {
    await db.authenticate()
    console.log('Conexion exitosa a la db')
} catch (error) {
    console.log(`Error de conexion: ${error}`)
}

app.get('/', (req,res)=>{
    res.send('Hola mundo!')
})

app.listen(PORT, ()=>{
    console.log('APLICACION CORRIENDO EN EL PUERTO: '+PORT)
})