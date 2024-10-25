import EstadoModel from "../models/EstadoModel.js";

export const getAllEstados = async (req, res) =>{
    try {
        const estado = await EstadoModel.findAll()
        res.json(estado);
    } catch (error) {
        res.json({message: error.message})
    }
};

export const createEstado = async (req, res) => {
    try {
        
        const { nombreEstado } = req.body;

        // Validamos que el nombreEstado exista
        if (!nombreEstado) {
            return res.status(400).json({ message: "El campo 'nombre' es requerido" });
        }

        
        const newEstado = await EstadoModel.create({
            nombreEstado,
            fechaCreacion: new Date(),        
        });

        
        res.status(201).json(newEstado);
    } catch (error) {
        // Manejo de errores
        res.status(500).json({ message: error.message });
    }
};

export const getEstado = async (req, res) =>{
    try {
        const estado = await EstadoModel.findAll({
            where:{id:req.params.id}
        })
        res.json(estado[0])
    } catch (error) {
        res.json({message: error.message})
    }
}

export const updateEstado = async (req, res) =>{
    try {
        const { nombreEstado } = req.body;
        if (!nombreEstado) {
            return res.status(400).json({ message: "El campo 'nombreEstado' es requerido" });
        }

        const updatedRows = await EstadoModel.update({
            nombreEstado,
            fechaModificacion: new Date()
        }, {
            where: { id: req.params.id }
        });

        if (updatedRows === 0) {
            return res.status(404).json({ message: "Estado no encontrado o no actualizado" });
        }

        res.status(200).json({ message: "Estado actualizado correctamente" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const deleteEstado = async (req, res) =>{
    try {        

        const [updatedRows] = await EstadoModel.update({
            activo:0,
            fechaModificacion: new Date()
        }, {
            where: { id: req.params.id }
        });

        if (updatedRows === 0) {
            return res.status(404).json({ message: "Estado no encontrado o no actualizado" });
        }

        res.status(200).json({ message: "Estado desactivado correctamente" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const activeEstado = async (req, res) =>{
    try {        

        const [updatedRows] = await EstadoModel.update({
            activo:1,
            fechaModificacion: new Date()
        }, {
            where: { id: req.params.id }
        });

        if (updatedRows === 0) {
            return res.status(404).json({ message: "Estado no encontrado o no actualizado" });
        }

        res.status(200).json({ message: "Estado activado correctamente" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}
