import bcryptjs from 'bcryptjs';
import jsonwebtoken from 'jsonwebtoken';
import dotenv from 'dotenv';
import UsuarioModel from '../models/UsuarioModel.js';

dotenv.config(); // Cargar variables de entorno desde el archivo .env

export async function Login(req, res) {
    const { correo, contrasenia } = req.body;

    // Verificar si se han proporcionado todos los campos necesarios
    if (!correo || !contrasenia) {
        return res.status(400).send({ status: "Error", message: "Debe llenar todos los campos." });
    }

    try {
        // Buscar al usuario por el correo
        const usuario = await UsuarioModel.findOne({
            attributes: ['id', 'activo', 'avatar', 'correo', 'nombre', 'contrasenia'],
            where: { 
                correo,
                activo: 1 
            }
        });
        
        console.log(usuario);
        // Verificar si el usuario existe
        if (!usuario) {
            return res.status(404).send({ status: "Error", message: "Usuario o contraseña incorrecta." });
        }

        
        const contraseniaCorrecta = await bcryptjs.compare(contrasenia, usuario.contrasenia);
        if (!contraseniaCorrecta) {
            return res.status(401).send({ status: "Error", message: "Usuario o contraseña incorrecta." });
        }

        // Generar un token JWT
        const token = jsonwebtoken.sign(
            { id: usuario.id, correo: usuario.correo },
            process.env.JWT_SECRET, 
            { expiresIn: '1h' }
        );

        // Generar una cookie
        const cookieOption = {
            maxAge: 24 * 60 * 60 * 1000,
            path: "/"
        }
        res.cookie("JWT",token,cookieOption); 
        // Responder con éxito e incluir el token
        return res.status(200).send({
            status: "Ok",
            message: "Inicio de sesión exitoso.",
            usuario: { id: usuario.id, nombre: usuario.nombre, correo: usuario.correo, avatar: usuario.avatar },
            redirect:"/Home"
        });
    } catch (error) {
        return res.status(500).send({ status: "Error", message: error.message });
    }
}
