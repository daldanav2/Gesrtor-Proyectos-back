import TareaModel from "../models/TareaModel.js";

export const getAllTares = async (req, res) =>{
    try {
        const tarea = await TareaModel.findAll()
        res.json(tarea);
    } catch (error) {
        res.json({message: error.message})
    }
}