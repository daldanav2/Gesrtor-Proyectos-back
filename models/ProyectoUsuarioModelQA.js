import db from "../database/db.js";
import { DataTypes } from "sequelize";

const ProyectoUsuarioModelQA = db.define('asigProyectoQA',{
    idProyecto: { type: DataTypes.INTEGER},
    idUsuario: { type: DataTypes.INTEGER},
    fechaCreacion: { type: DataTypes.DATEONLY},
}, {
        freezeTableName: true, 
        timestamps: false 
});

export default ProyectoUsuarioModelQA