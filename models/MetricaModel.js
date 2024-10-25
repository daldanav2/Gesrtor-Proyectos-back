import db from "../database/db.js";
import { DataTypes } from "sequelize";

const MetricaModel = db.define('metrica',{
    nombreMetrica: { type: DataTypes.STRING},
    descripcion: { type: DataTypes.STRING},
    justificacion: { type: DataTypes.STRING},
    idUsuario: { type: DataTypes.INTEGER},
    idProyecto: { type: DataTypes.INTEGER},
    ponderacion: { type: DataTypes.INTEGER},
    fechaCreacion: { type: DataTypes.DATEONLY},
    fechaModificacion: { type: DataTypes.DATEONLY},
    estado: { type: DataTypes.NUMBER},
    activo: { type: DataTypes.NUMBER}
}, {
    freezeTableName: true, 
    timestamps: false 
});

export default MetricaModel