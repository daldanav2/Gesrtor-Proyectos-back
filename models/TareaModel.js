import db from "../database/db.js";
import { DataTypes } from "sequelize";

const TareaModel = db.define('tarea',{
    nombreTarea: { type: DataTypes.STRING},
    descripcion: { type: DataTypes.STRING},
    idUsuario: { type: DataTypes.INTEGER},
    idProyecto: { type: DataTypes.INTEGER},
    fechaCreacion: { type: DataTypes.DATEONLY},
    fechaModificacion: { type: DataTypes.DATEONLY},
    nota: { type: DataTypes.STRING},
    estado: { type: DataTypes.NUMBER},
    activo: { type: DataTypes.NUMBER}
}, {
    freezeTableName: true, 
    timestamps: false 
});

export default TareaModel