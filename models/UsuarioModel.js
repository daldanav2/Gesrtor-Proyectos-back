import db from "../database/db.js";

import { DataTypes } from "sequelize";

const UsuarioModel = db.define('usuario', {
    nombre: { type: DataTypes.STRING },
    correo: { type: DataTypes.STRING},
    contrasenia: { type: DataTypes.STRING},
    fechaCreacion: { type: DataTypes.DATE},
    fechaModificacion: { type: DataTypes.DATE},
    usuarioModificacion: { type: DataTypes.NUMBER},
    activo: { type: DataTypes.NUMBER},
    nombreAvatar: { type: DataTypes.STRING},
    avatar: { type: DataTypes.STRING}
}, {
    freezeTableName: true, 
    timestamps: false 
});

export default UsuarioModel