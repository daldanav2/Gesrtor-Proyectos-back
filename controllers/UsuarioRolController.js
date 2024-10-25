import UsuarioRolModel from "../models/UsurioRolModel.js";
import RolModel from "../models/RolModel.js";
import UsuarioModel from "../models/UsuarioModel.js";
import MenuRolModel from "../models/MenuRolModel.js";
import MenuModel from "../models/MenuModel.js";
UsuarioRolModel.belongsTo(UsuarioModel, { foreignKey: 'idUsuario' });
UsuarioRolModel.belongsTo(RolModel, { foreignKey: 'idRol' });

export const getMenusByUsuario = async (req, res) => {
    try {

        const id = req.body.id;
        // Primero obtenemos los roles del usuario
        const userRoles = await UsuarioRolModel.findAll({
            where: { idUsuario: id },
            attributes: ['idRol'],
        });

        // Extraemos los IDs de roles
        const roleIds = userRoles.map(role => role.idRol);

        // Obtenemos los menús asociados a esos roles
        const menuRoles = await MenuRolModel.findAll({
            where: {
                idRol: roleIds // Busca menús que correspondan a cualquiera de los roles del usuario
            },
            attributes: ['idMenu'],
        });

        const menuIds = menuRoles.map(menu => menu.idMenu);

        // Transformamos los resultados para obtener una lista única de menús
        const menu = await MenuModel.findAll({
            where:{
                id: menuIds
            }
        });

        const padresIds = [...new Set(menu.map(padre => padre.padre))];

        const menuPadre = await MenuModel.findAll({
            where:{
                id:padresIds
            }
        })

        res.json({ menuPadre: menuPadre, menusHijos: menu });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getUsurioRol = async (req, res) => {
    try {
        const usuarioRol = await UsuarioRolModel.findAll({
            where: { idRol: req.params.id },
            include: [
                {
                    model: RolModel,
                    attributes: ['id', 'nombreRol'],
                },
                {
                    model: UsuarioModel,
                    attributes: ['id'],
                },
            ],
        });

        
        const rolList = usuarioRol.map(item => ({
            id: item.rol.id,
            nombreRol: item.rol.nombreRol,
        }));

        res.json({ rol: rolList });
    } catch (error) {
        res.json({ message: error.message });
    }
};

export const createUsurioRol = async (req, res) =>{
    try {
        const { idUsuario } = req.body;
        const { idRol } = req.body;

        const newUsuarioRol = await UsuarioRolModel.create({
            idUsuario,
            idRol,
            fechaCreacion: new Date(),
        });
        res.status(201).json(newUsuarioRol);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const deleteUsuarioRol = async (req, res) => {
    try {       
        const result = await UsuarioRolModel.destroy({
            where: { idRol: req.params.id }
        });

        if (result) {
            res.status(200).json({ message: 'Registro eliminado correctamente' });
        } else {
            res.status(404).json({ message: 'Registro no encontrado' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

