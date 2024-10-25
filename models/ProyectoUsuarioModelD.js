import db from "../database/db.js";
import { DataTypes } from "sequelize";

const ProyectoUsuarioModelD = db.define('asigProyectoDesarrollo',{
    idProyecto: { type: DataTypes.INTEGER},
    idUsuario: { type: DataTypes.INTEGER},
    fechaCreacion: { type: DataTypes.DATEONLY},
}, {
        freezeTableName: true, // Evita la pluralización de la tabla
        timestamps: false // Desactiva createdAt y updatedAt
});

export default ProyectoUsuarioModelD