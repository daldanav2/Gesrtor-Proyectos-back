import db from "../database/db.js";
import { DataTypes } from "sequelize";

const MenuRolModel = db.define('menuRol',{
    idMenu: { type: DataTypes.INTEGER},
    idRol: { type: DataTypes.INTEGER},
    fechaCreacion: { type: DataTypes.DATEONLY},
    fechaModificacion: { type: DataTypes.DATEONLY}
}, {
        freezeTableName: true, // Evita la pluralización de la tabla
        timestamps: false // Desactiva createdAt y updatedAt
});

export default MenuRolModel