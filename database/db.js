import { Sequelize } from "sequelize";

const db = new Sequelize('GestorProyectos', 'root', 'ophcwwbRvuUFpJQtBJlEgfXjyyTbGUeX',{
    host:'junction.proxy.rlwy.net',
    port:'34222',
    dialect:'mysql',
    timezone: '-06:00',
});

export default db;