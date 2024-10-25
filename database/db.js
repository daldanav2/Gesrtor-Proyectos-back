import { Sequelize } from "sequelize";
import dotenv from 'dotenv';
dotenv.config() 

const db = new Sequelize(process.env.DATABASE, process.env.USERDB, process.env.PASSWORDDB,{
    host:process.env.HOSTDB,
    port:process.env.PORTDB,
    dialect:'mysql',
    timezone: '-06:00',
});

export default db;