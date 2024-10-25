import UsuarioModel from "../models/UsuarioModel.js";
import UsuarioRolModel from "../models/UsurioRolModel.js";
import RolModel from "../models/RolModel.js";
import bcrypt from "bcryptjs";
import multer from "multer";
UsuarioModel.hasOne(UsuarioRolModel, { foreignKey: 'idUsuario' });
UsuarioRolModel.belongsTo(UsuarioModel, { foreignKey: 'idUsuario' });
UsuarioRolModel.belongsTo(RolModel, { foreignKey: 'idRol' });
RolModel.hasMany(UsuarioRolModel, { foreignKey: 'idRol' });

const storage = multer.memoryStorage(); // Guardar en memoria temporalmente
const upload = multer({ storage });


export const getAllUsers = async (req, res) =>{
    try {
        const usuario = await UsuarioModel.findAll({
            attributes: ['id', 'activo', 'avatar', 'correo', 'nombre'],
            include: [
                {
                    model: UsuarioRolModel,
                    attributes: ['idRol'],
                    include: [
                        {
                            model: RolModel,
                            attributes: ['nombreRol'],
                        }
                    ]
                }
            ]
        })
        const usuariosModificados = usuario.map(usuario => {
            const usuarioRol = usuario.usuarioRol; // Obtener el usuarioRol asociado
            const rol = usuarioRol ? usuarioRol.rol : null; // Obtener el rol si existe

            return {
                age: "25",
                avatar: usuario.avatar,
                email: usuario.correo,
                id: usuario.id,
                name: usuario.nombre,
                role: rol ? rol.nombreRol : "Sin rol", // Nombre del rol si existe
                idRol: usuarioRol ? usuarioRol.idRol : null, // idRol si existe
                status: usuario.activo === 1 ? 'active' : 'inactive',
                team: "Admin",
            };
        });
        res.json(usuariosModificados);
    } catch (error) {
        res.json({message: error.message})
    }
}

export const getAllUsersQA = async (req, res) => {
    try {
        const usuarios = await UsuarioModel.findAll({
            attributes: ['id', 'nombre'],
            include: [
                {
                    model: UsuarioRolModel,
                    attributes: ['idRol'],
                    where: { idRol: 11 }, 
                    include: [
                        {
                            model: RolModel,
                            attributes: ['nombreRol'],
                        }
                    ]
                }
            ]
        });

        res.json(usuarios);
    } catch (error) {
        res.json({ message: error.message });
    }
};

export const getAllUsersD = async (req, res) => {
    try {
        const usuarios = await UsuarioModel.findAll({
            attributes: ['id', 'nombre'],
            include: [
                {
                    model: UsuarioRolModel,
                    attributes: ['idRol'],
                    where: { idRol: 12 }, 
                    include: [
                        {
                            model: RolModel,
                            attributes: ['nombreRol'],
                        }
                    ]
                }
            ]
        });

        res.json(usuarios);
    } catch (error) {
        res.json({ message: error.message });
    }
};


export const createUsuario = async (req, res) => {
    try {
        // Desestructurar los campos del body
        const { nombre, correo, idRol } = req.body;
        const contrasenia = "ProyectoFinal2024@";

        // Validar que los campos requeridos existan
        if (!nombre || !correo) {
            return res.status(400).json({ message: "Los campos 'nombre' y 'correo' son requeridos" });
        }

        const avatarBase64 = 'data:image/png;base64,'+req.file.buffer.toString("base64");
        const nombreAvatar = req.file.originalname.replace(/\.(png|jpg|jpeg)$/i, '');

        // Generar el hash de la contraseña
        const salt = await bcrypt.genSalt(10); // Usar await ya que es una operación asíncrona
        const hashContrasenia = await bcrypt.hash(contrasenia, salt); // Hash de la contraseña

        // Crear un nuevo usuario
        const newUsuario = await UsuarioModel.create({
            nombre,
            correo,
            contrasenia: hashContrasenia, 
            fechaCreacion: new Date(),
            nombreAvatar,
            avatar: avatarBase64,
        });
        
        if (newUsuario) {
            const usuarioRol = await UsuarioRolModel.create({
                idUsuario:newUsuario.id,
                idRol:idRol,
                fechaCreacion: new Date(),
            });
            
            const usuario = await UsuarioModel.findAll({
                attributes: ['id', 'activo', 'avatar', 'correo', 'nombre'],
                include: [
                    {
                        model: UsuarioRolModel,
                        attributes: ['idRol'],
                        include: [
                            {
                                model: RolModel,
                                attributes: ['nombreRol'],
                            }
                        ]
                    }
                ],
                where:{id:newUsuario.id}
            })
            const usuariosModificados = usuario.map(usuario => {
                const usuarioRol = usuario.usuarioRol; // Obtener el usuarioRol asociado
                const rol = usuarioRol ? usuarioRol.rol : null; // Obtener el rol si existe
    
                return {
                    age: "25",
                    avatar: usuario.avatar,
                    email: usuario.correo,
                    id: usuario.id,
                    name: usuario.nombre,
                    role: rol ? rol.nombreRol : "Sin rol", // Nombre del rol si existe
                    idRol: usuarioRol ? usuarioRol.idRol : null, // idRol si existe
                    status: usuario.activo === 1 ? 'active' : 'inactive',
                    team: "Admin",
                };
            });
            return res.status(201).json({ message: "Usuario creado con éxito", usuario: usuariosModificados[0] });
        } else {
            return res.status(400).json({ message: "Error al crear el usuario" });
        }

    } catch (error) {
        // Manejo de errores con mensaje específico
        res.status(500).json({ message: "Error al tratar de ingresar el nuevo usuario", error: error.message });
    }
};

export const uploadAvatar = upload.single("avatar");

export const getUsuario = async (req, res) =>{
    try {
        const estado = await UsuarioModel.findAll({
            where:{id:req.params.id}
        })
        res.json(estado[0])
    } catch (error) {
        res.json({message: error.message})
    }
}

export const changePassword = async (req, res) =>{
    try {
        const { contrasenia } = req.body;
        if (!contrasenia) {
            return res.status(400).json({ message: "El campo contraseña es requerido" });
        }

        const updatedRows = await UsuarioModel.update({
            contrasenia,
            fechaModificacion: new Date()
        }, {
            where: { id: req.params.id }
        });

        if (updatedRows === 0) {
            return res.status(404).json({ message: "Usuario no encontrado o no actualizado" });
        }

        res.status(200).json({ message: "Usuario actualizado correctamente" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const updateUsuario = async (req, res) => {
    try {
        const { id, nombre, idRol } = req.body;
        if (!nombre || !idRol) {
            return res.status(400).json({ message: "Debe de llenar todos los campos." });
        }

        const avatarBase64 = 'data:image/png;base64,' + req.file.buffer.toString("base64");
        const nombreAvatar = req.file.originalname.replace(/\.(png|jpg|jpeg)$/i, '');

        // Actualizar usuario
        const [updatedRows] = await UsuarioModel.update({
            nombre,
            nombreAvatar,
            avatar: avatarBase64,
            fechaModificacion: new Date()
        }, {
            where: { id: id }
        });

        if (updatedRows) {
            // Eliminar el rol actual del usuario
            await UsuarioRolModel.destroy({
                where: { idUsuario: id }
            });

            // Crear nueva asociación de rol
            await UsuarioRolModel.create({
                idUsuario: id,
                idRol: idRol,
                fechaCreacion: new Date(),
            });

            // Obtener el usuario actualizado con su rol
            const usuario = await UsuarioModel.findOne({
                where: { id: id },
                attributes: ['id', 'activo', 'avatar', 'correo', 'nombre'],
                include: [
                    {
                        model: UsuarioRolModel,
                        attributes: ['idRol'],
                        include: [
                            {
                                model: RolModel,
                                attributes: ['nombreRol'],
                            }
                        ]
                    }
                ]
            });

            // Verificar si se ha encontrado y asociado correctamente el rol
            const usuarioRol = usuario.usuarioRol;
            const rol = usuarioRol ? usuarioRol.rol : null;

            const usuarioModificado = {
                age: "25",
                avatar: usuario.avatar,
                email: usuario.correo,
                id: usuario.id,
                name: usuario.nombre,
                role: rol ? rol.nombreRol : "Sin rol",
                idRol: usuarioRol ? usuarioRol.idRol : null,
                status: usuario.activo === 1 ? 'active' : 'inactive',
                team: "Admin",
            };

            return res.status(201).json({ message: "Usuario actualizado con éxito", usuario: usuarioModificado });
        } else {
            return res.status(400).json({ message: "Error al actualizar el usuario" });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


export const deleteUsuario = async (req, res) =>{
    try {        
        const id = req.body.id;
        const updatedRows = await UsuarioModel.update({
            activo:0,
            fechaModificacion: new Date()
        }, {
            where: { id: id}
        });

        if (!updatedRows) {
            return res.status(404).json({ message: "Usuario no encontrado o no actualizado" });
        }

        res.status(200).json({ message: "Usuario desactivado correctamente" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const activeUsuario = async (req, res) =>{
    try {        
        const id = req.body.id;
        const updatedRows = await UsuarioModel.update({
            activo:1,
            fechaModificacion: new Date()
        }, {
            where: { id: id }
        });

        if (!updatedRows) {
            return res.status(404).json({ message: "Usuario no encontrado o no actualizado" });
        }

        res.status(200).json({ message: "Usuario activado correctamente" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}