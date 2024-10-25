import MenuModel from "../models/MenuModel.js";
import { Op } from "sequelize";

export const getAllMenu = async (req, res) =>{
    try {
        const menu = await MenuModel.findAll()
        res.json(menu);
    } catch (error) {
        res.json({message: error.message})
    }
}

export const getPadre = async (req, res) =>{
    try {
        const menu = await MenuModel.findAll({
            where: { padre: 0 }  
        })
        const menuSinPadre = [
            { 
                id: 0, 
                nombreMenu: 'Sin Padre', 
                padre: 0, 
                link: '#', 
                icono: '', 
                fechaCreacion: null, 
                fechaModificacion: null, 
                usuarioModificacion: null, 
                usuarioCreacion: null, 
                activo: 1 
            },
            ...menu 
        ];

        res.json(menuSinPadre);
    } catch (error) {
        res.json({message: error.message})
    }
}

export const getHijo = async (req, res) =>{
    try {
        const menu = await MenuModel.findAll({
            where: { padre: { [Op.ne]: 0 } }
        })
        res.json(menu);
    } catch (error) {
        res.json({message: error.message})
    }
}

export const createMenu = async (req, res) =>{
    try {
        const { nombre } = req.body;
        const { idPadre } = req.body;
        const { link } = req.body;
        const { icono } = req.body;
        if(!nombre && !padre && !link && !icono){
            return res.status(400).json({message:"Todos los campos deben de esta llenos."})
        }

        const newEstado = await MenuModel.create({
            nombreMenu: nombre,
            padre: idPadre,
            link,
            icono,
            fechaCreacion: new Date(),
        });

        const newMenu = await MenuModel.findAll({
            where: {id: newEstado.id}
        })
        
        res.status(201).json({message:"Menu Creado con exito.", menu:newMenu[0]});
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const getMenu = async (req, res) =>{
    try {
        const menu = await MenuModel.findAll({
            where:{id:req.params.id}
        })
        res.json(menu[0]);
    } catch (error) {
        res.json({message: error.message})
    }
}

export const updateMenu = async (req, res) =>{
    try {
        const { nombreMenu } = req.body;
        const { padre } = req.body;
        const { link } = req.body;
        const { icono } = req.body;
        const { usuarioModificacion } = req.body;
        if(!nombreMenu && !padre && !link && !icono){
            return res.status(400).json({message:"Todos los campos deben de esta llenos."})
        }
        const updatedRows = await MenuModel.update({
            nombreMenu,
            usuarioModificacion,
            padre,
            link,
            icono,
            fechaModificacion: new Date()
        },{
            where: { id: req.params.id }
        })
        if (updatedRows === 0) {
            return res.status(404).json({ message: "Menu no encontrado o no actualizado" });
        }
        res.status(200).json({ message: "Menu actualizado correctamente" });
    } catch (error) {
        res.status(500).json({ message: error.message });    
    }
}

export const deleteMenu = async (req, res) =>{
    try {
        const [updatedRows] = await MenuModel.update({
            activo:0,
            fechaModificacion: new Date()
        }, {
            where: { id: req.params.id }
        });

        if (updatedRows === 0) {
            return res.status(404).json({ message: "Menu no encontrado o no actualizado" });
        }

        res.status(200).json({ message: "Menu desactivado correctamente" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const activeMenu = async (req, res) =>{
    try {
        const [updatedRows] = await MenuModel.update({
            activo:1,
            fechaModificacion: new Date()
        }, {
            where: { id: req.params.id }
        });

        if (updatedRows === 0) {
            return res.status(404).json({ message: "Menu no encontrado o no actualizado" });
        }

        res.status(200).json({ message: "Menu activado correctamente" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}
