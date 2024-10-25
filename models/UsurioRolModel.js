import db from "../database/db.js";

import { DataTypes } from "sequelize";

const UsuarioRolModel = db.define('usuarioRol', {
    idUsuario: { type: DataTypes.INTEGER },
    idRol: { type: DataTypes.INTEGER},
    fechaCreacion: { type: DataTypes.DATE}
}, {
    freezeTableName: true, 
    timestamps: false 
});

export default UsuarioRolModel