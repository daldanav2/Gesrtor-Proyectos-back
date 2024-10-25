import { Sequelize } from "sequelize";
import dotenv from 'dotenv';
dotenv.config()
process.env.PORT

const db = new Sequelize(process.env.DATABASE, 'root', process.env.PASSWORDDB,{
    host:process.env.HOSTDB,
    port:process.env.PORTDB,
    dialect:'mysql',
    timezone: '-06:00',
});

export default db;