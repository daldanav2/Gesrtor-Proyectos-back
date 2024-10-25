import db from "../database/db.js";

import { DataTypes } from "sequelize";

const RolModel = db.define('rol', {
    nombreRol: { type: DataTypes.STRING },
    fechaCreacion: { type: DataTypes.DATEONLY},
    usuarioCreacion: { type: DataTypes.NUMBER},
    fechaModificacion: { type: DataTypes.DATEONLY},
    usuarioModicacion: { type: DataTypes.NUMBER},
    activo: { type: DataTypes.NUMBER}
}, {
    freezeTableName: true, 
    timestamps: false 
});

export default RolModel