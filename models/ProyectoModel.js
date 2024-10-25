import db from "../database/db.js";

import { DataTypes } from "sequelize";

const ProyectoModel = db.define('proyecto', {
    nombreProyecto: { type: DataTypes.STRING },
    descripcion: { type: DataTypes.STRING},
    fechaCreacion: { type: DataTypes.DATEONLY},
    fechaModificacion: { type: DataTypes.NUMBER}
}, {
    freezeTableName: true, // Evita la pluralización de la tabla
    timestamps: false // Desactiva createdAt y updatedAt
});

export default ProyectoModel