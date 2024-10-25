import MenuRolModel from "../models/MenuRolModel.js";
import RolModel from "../models/RolModel.js";

export const getAllRols = async (req, res) =>{
    try {
        const rol = await RolModel.findAll();
        res.json(rol);
    } catch (error) {
        res.json({message: error.message});
    }
}

export const getRol = async (req, res) =>{
    try {
        const rol = await RolModel.findAll({
            where:{id:req.params.id}
        })
        res.json(rol[0])
    } catch (error) {
        res.json({message: error.message})
    }
}

export const createRol = async (req, res) => {
    try {
        const { nombre, idMenus } = req.body;
        
        if (!nombre) {
            return res.status(400).json({ message: "El campo 'nombre' es requerido" });
        }

        if (!Array.isArray(idMenus) || idMenus.length === 0) {
            return res.status(400).json({ message: "Debe seleccionar al menos un menú" });
        }

        // Convertir array de strings a números y validar
        const idMenuArray = idMenus.map(id => parseInt(id));
        if (idMenuArray.some(id => isNaN(id))) {
            return res.status(400).json({ message: "IDs de menú inválidos" });
        }

        try {
            // Crear el nuevo rol
            const newRol = await RolModel.create({
                nombreRol: nombre,
                fechaCreacion: new Date(),        
            });

            // Preparar datos para inserción masiva
            const menuRolData = idMenuArray.map(idMenu => ({
                idRol: newRol.id,
                idMenu: idMenu,
                fechaCreacion: new Date()
            }));

            
            await MenuRolModel.bulkCreate(menuRolData);

            const rol = await RolModel.findAll({
                where: { id: newRol.id }
            });
                
            res.status(201).json({ 
                message: "Rol creado con éxito.", 
                rol: rol[0]
            });

        } catch (error) {
            throw error;
        }

    } catch (error) {
        console.error("Error al crear rol:", error);
        res.status(500).json({ 
            message: "Error al crear el rol", 
            error: error.message 
        });
    }
};

export const updateRol = async (req, res) =>{
    try {
        const { nombre, idRol, idMenus } = req.body;        

        

        try {
            const updatedRows = await RolModel.update({
                nombreRol: nombre,
                fechaModificacion: new Date()
            }, {
                where: { id: idRol}
            });

            if (!updatedRows) {
                return res.status(404).json({ message: "Rol no encontrado o no actualizado" });
            }
            const menuRolData = idMenus.map(idMenu => ({
                idRol: idRol,
                idMenu: idMenu,
                fechaCreacion: new Date()
            }));

            await MenuRolModel.destroy({
                where: {idRol: idRol}
            })
            await MenuRolModel.bulkCreate(menuRolData);

            const rol = await RolModel.findAll({
                where: { id: idRol }
            });
                
            res.status(201).json({ 
                message: "Rol creado con éxito.", 
                rol: rol[0]
            });

        } catch (error) {
            throw error;
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const deleteRol = async (req, res) =>{
    try {        
        const id = req.body.id;
        const updatedRows = await RolModel.update({
            activo:0,
            fechaModificacion: new Date()
        }, {
            where: { id: id }
        });

        if (!updatedRows) {
            return res.status(404).json({ reg:0, message: "Rol no encontrado o no actualizado" });
        }

        res.status(200).json({ reg:1, message: "Rol desactivado correctamente" });
    } catch (error) {
        res.status(500).json({ reg:0, message: error.message });
    }
}

export const activeRol = async (req, res) =>{
    try {        
        const id = req.body.id;
        const updatedRows = await RolModel.update({
            activo:1,
            fechaModificacion: new Date()
        }, {
            where: { id: id }
        });

        if (!updatedRows) {
            return res.status(404).json({ reg:0, message: "Rol no encontrado o no actualizado" });
        }

        res.status(200).json({ reg:1, message: "Rol activado correctamente" });
    } catch (error) {
        res.status(500).json({ reg:0, message: error.message });
    }
}


