import db from "../database/db.js";
import { DataTypes } from "sequelize";

const MenuModel = db.define('menu',{
    nombreMenu: { type: DataTypes.STRING},
    padre: { type: DataTypes.INTEGER},
    link: { type: DataTypes.STRING},
    icono: { type: DataTypes.STRING},
    fechaCreacion: { type: DataTypes.DATEONLY},
    fechaModificacion: { type: DataTypes.DATEONLY},
    usuarioModificacion: {type: DataTypes.INTEGER},
    usuarioCreacion: { type:DataTypes.INTEGER},
    activo: {type: DataTypes.INTEGER}
}, {
        freezeTableName: true, // Evita la pluralización de la tabla
        timestamps: false // Desactiva createdAt y updatedAt
});

export default MenuModel