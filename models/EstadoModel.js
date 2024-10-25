import db from "../database/db.js";
import { DataTypes } from "sequelize";

const EstadoModel = db.define('estado', {
    nombreEstado: { type: DataTypes.STRING},
    fechaCreacion: { type: DataTypes.DATE},
    fechaModificacion: { type: DataTypes.DATE},
    activo: { type: DataTypes.NUMBER}
}, {
    freezeTableName: true, 
    timestamps: false 
});

export default EstadoModel