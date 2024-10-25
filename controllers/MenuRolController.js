import MenuRolModel from "../models/MenuRolModel.js";
import MenuModel from "../models/MenuModel.js";
import RolModel from "../models/RolModel.js";
MenuRolModel.belongsTo(MenuModel, { foreignKey: 'idMenu' });
MenuRolModel.belongsTo(RolModel, { foreignKey: 'idRol' });


export const getMenuRol = async (req, res) => {
    try {
        const estado = await MenuRolModel.findAll({
            where: { idRol: req.params.id },
            include: [
                {
                    model: MenuModel,
                    attributes: ['id', 'nombreMenu'],
                },
                {
                    model: RolModel,
                    attributes: ['id'],
                },
            ],
        });

        
        const menuList = estado.map(item => ({
            id: item.menu.id,
            nombreMenu: item.menu.nombreMenu,
        }));

        res.json({ menu: menuList });
    } catch (error) {
        res.json({ message: error.message });
    }
};

export const createMenuRol = async (req, res) =>{
    try {
        const { idMenu } = req.body;
        const { idRol } = req.body;

        const newMenuRol = await MenuRolModel.create({
            idMenu,
            idRol,
            fechaCreacion: new Date(),
        });
        res.status(201).json(newMenuRol);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const deleteMenuRol = async (req, res) => {
    try {       
        const result = await MenuRolModel.destroy({
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


