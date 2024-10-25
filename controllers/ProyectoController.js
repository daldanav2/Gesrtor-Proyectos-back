import { where } from "sequelize";
import db from "../database/db.js";
import MetricaModel from "../models/MetricaModel.js";
import ProyectoModel from '../models/ProyectoModel.js'
import ProyectoUsuarioModelD from "../models/ProyectoUsuarioModelD.js";
import ProyectoUsuarioModelQA from "../models/ProyectoUsuarioModelQA.js";
import PruebaModel from "../models/PruebaModel.js";
import TareaModel from "../models/TareaModel.js";

export const getAllProyects = async (req, res) => {
    try {
        const [results] = await db.query(`
            WITH Desarrollo AS (
                SELECT 
                    p.id AS idProyecto, 
                    p.nombreProyecto, 
                    p.descripcion,
                    GROUP_CONCAT(DISTINCT u.nombre SEPARATOR ', ') AS usuarios_desarrollo, 
                    COUNT(CASE WHEN t.estado = 4 THEN 1 END) * 100.0 / NULLIF(COUNT(t.id), 0) AS porcentaje_desarrollo
                FROM GestorProyectos.proyecto p
                JOIN GestorProyectos.asigProyectoDesarrollo apd ON p.id = apd.idProyecto
                JOIN GestorProyectos.usuario u ON apd.idUsuario = u.id
                LEFT JOIN GestorProyectos.tarea t ON p.id = t.idProyecto AND apd.idUsuario = t.idUsuario
                GROUP BY p.id, p.nombreProyecto, p.descripcion
            ),
            Calidad AS (
                SELECT 
                    p.id AS idProyecto, 
                    GROUP_CONCAT(DISTINCT u.nombre SEPARATOR ', ') AS usuarios_calidad, 
                    COUNT(CASE WHEN t.estado = 4 THEN 1 END) * 100.0 / NULLIF(COUNT(t.id), 0) AS porcentaje_calidad
                FROM GestorProyectos.proyecto p
                JOIN GestorProyectos.asigProyectoQA apq ON p.id = apq.idProyecto
                JOIN GestorProyectos.usuario u ON apq.idUsuario = u.id
                LEFT JOIN GestorProyectos.prueba t ON p.id = t.idProyecto AND apq.idUsuario = t.idUsuario
                GROUP BY p.id
            )
            SELECT 
                d.idProyecto, 
                d.nombreProyecto AS nombre, 
                d.descripcion, 
                d.usuarios_desarrollo, 
                d.porcentaje_desarrollo, 
                c.usuarios_calidad, 
                c.porcentaje_calidad
            FROM Desarrollo d
            LEFT JOIN Calidad c ON d.idProyecto = c.idProyecto;
        `);

        res.json(results);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getProyectByUserQA = async (req, res) => {
    const { idUsuario } = req.body;
    try {
        const [results] = await db.query(`
            SELECT 
                p.id AS idProyecto, 
                p.nombreProyecto, 
                p.descripcion,
                COUNT(CASE WHEN t.estado = 4 THEN 1 END) * 100.0 / NULLIF(COUNT(t.id), 0) AS porcentaje_desarrollo
            FROM GestorProyectos.proyecto p
            JOIN GestorProyectos.asigProyectoQA apd ON p.id = apd.idProyecto
            JOIN GestorProyectos.usuario u ON apd.idUsuario = u.id
            LEFT JOIN GestorProyectos.prueba t ON p.id = t.idProyecto AND apd.idUsuario = t.idUsuario
            WHERE u.id=`+ idUsuario + ` 
            GROUP BY p.id, p.nombreProyecto, p.descripcion;
        `);

        res.json(results);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getProyectByUserD = async (req, res) => {
    const { idUsuario } = req.body;
    try {
        const [results] = await db.query(`
            SELECT 
                p.id AS idProyecto, 
                p.nombreProyecto, 
                p.descripcion,
                COUNT(CASE WHEN t.estado = 4 THEN 1 END) * 100.0 / NULLIF(COUNT(t.id), 0) AS porcentaje_desarrollo
            FROM GestorProyectos.proyecto p
            JOIN GestorProyectos.asigProyectoDesarrollo apd ON p.id = apd.idProyecto
            JOIN GestorProyectos.usuario u ON apd.idUsuario = u.id
            LEFT JOIN GestorProyectos.tarea t ON p.id = t.idProyecto AND apd.idUsuario = t.idUsuario
            WHERE u.id=`+ idUsuario + ` 
            GROUP BY p.id, p.nombreProyecto, p.descripcion;
        `);

        res.json(results);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getProyectDetalleByUserD = async (req, res) => {
    const { idUsuario, idProyecto } = req.body;
    try {
        const [results] = await db.query(`
            SELECT 
                t.id,
                t.nombreTarea,
                t.descripcion,
                t.estado,
                t.nota
            FROM GestorProyectos.proyecto p
            JOIN GestorProyectos.asigProyectoDesarrollo apd ON p.id = apd.idProyecto
            JOIN GestorProyectos.usuario u ON apd.idUsuario = u.id
            JOIN GestorProyectos.tarea t ON p.id = t.idProyecto AND apd.idUsuario = t.idUsuario
            WHERE u.id=`+ idUsuario + ` and apd.idProyecto=` + idProyecto + `
        `);

        res.json(results);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getProyectDetalleByUserQA = async (req, res) => {
    const { idUsuario, idProyecto } = req.body;
    try {
        const [pruebas] = await db.query(`
            SELECT 
                t.id,
                t.nombrePrueba,
                t.descripcion,
                t.estado,
                t.nota
            FROM GestorProyectos.proyecto p
            JOIN GestorProyectos.asigProyectoQA apd ON p.id = apd.idProyecto
            JOIN GestorProyectos.usuario u ON apd.idUsuario = u.id
            JOIN GestorProyectos.prueba t ON p.id = t.idProyecto AND apd.idUsuario = t.idUsuario
            WHERE u.id=`+ idUsuario + ` and apd.idProyecto=` + idProyecto + `
        `);
        const [metricas] = await db.query(`
			SELECT 
				t.id, 
                t.nombreMetrica, 
                t.descripcion, 
                t.ponderacion, 
                t.justificacion, 
                estado
            FROM GestorProyectos.proyecto p
            JOIN GestorProyectos.asigProyectoQA apd ON p.id = apd.idProyecto
            JOIN GestorProyectos.usuario u ON apd.idUsuario = u.id
            JOIN GestorProyectos.metrica t ON p.id = t.idProyecto AND apd.idUsuario = t.idUsuario
            WHERE u.id=`+ idUsuario + ` and apd.idProyecto=` + idProyecto + `
        `);
        const results = { pruebas, metricas };
        res.json(results);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getProyectDetalle = async (req, res) => {
    const { idProyecto } = req.body;
    try {

        const [tareas] = await db.query(`
            SELECT 
                t.id,
                t.nombreTarea,
                t.descripcion,                
                e.nombreEstado estado,
                t.nota
            FROM GestorProyectos.proyecto p
            JOIN GestorProyectos.asigProyectoDesarrollo apd ON p.id = apd.idProyecto
            JOIN GestorProyectos.usuario u ON apd.idUsuario = u.id
            JOIN GestorProyectos.tarea t ON p.id = t.idProyecto AND apd.idUsuario = t.idUsuario
            JOIN GestorProyectos.estado e ON t.estado=e.id
            WHERE apd.idProyecto=` + idProyecto + `
        `);

        const [pruebas] = await db.query(`
            SELECT 
                t.id,
                t.nombrePrueba,
                t.descripcion,
                e.nombreEstado estado,
                t.nota
            FROM GestorProyectos.proyecto p
            JOIN GestorProyectos.asigProyectoQA apd ON p.id = apd.idProyecto
            JOIN GestorProyectos.usuario u ON apd.idUsuario = u.id
            JOIN GestorProyectos.prueba t ON p.id = t.idProyecto AND apd.idUsuario = t.idUsuario
            JOIN GestorProyectos.estado e ON t.estado=e.id
            WHERE apd.idProyecto=` + idProyecto + `
        `);
        const [metricas] = await db.query(`
			SELECT 
				t.id, 
                t.nombreMetrica, 
                t.descripcion, 
                t.ponderacion, 
                t.justificacion, 
                estado
            FROM GestorProyectos.proyecto p
            JOIN GestorProyectos.asigProyectoQA apd ON p.id = apd.idProyecto
            JOIN GestorProyectos.usuario u ON apd.idUsuario = u.id
            JOIN GestorProyectos.metrica t ON p.id = t.idProyecto AND apd.idUsuario = t.idUsuario
            WHERE apd.idProyecto=` + idProyecto + `
        `);
        const results = { pruebas, metricas, tareas };
        res.json(results);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const updateStatusNoteTarea = async (req, res) => {
    const { usuario, idTarea, estado, nota, idProyecto } = req.body;

    try {
        // Actualizar la tarea
        const tarea = await TareaModel.update(
            {
                estado,
                nota
            },
            {
                where: { id: idTarea }
            }
        );

        if (tarea[0] > 0) { // Verificamos que al menos una fila fue actualizada
            const [results] = await db.query(`
                SELECT 
                    p.id AS idProyecto, 
                    p.nombreProyecto, 
                    p.descripcion,
                    COUNT(CASE WHEN t.estado = 4 THEN 1 END) * 100.0 / NULLIF(COUNT(t.id), 0) AS porcentaje_desarrollo
                FROM GestorProyectos.proyecto p
                JOIN GestorProyectos.asigProyectoDesarrollo apd ON p.id = apd.idProyecto
                JOIN GestorProyectos.usuario u ON apd.idUsuario = u.id
                LEFT JOIN GestorProyectos.tarea t ON p.id = t.idProyecto AND apd.idUsuario = t.idUsuario
                WHERE u.id=`+ usuario + ` and p.id=` + idProyecto + `
                GROUP BY p.id, p.nombreProyecto, p.descripcion;
            `);

            res.json(results);
        } else {
            res.status(500).json({ message: "No se encontró la tarea para actualizar o no se realizaron cambios." });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const updateStatusNotePrueba = async (req, res) => {
    const { usuario, idPrueba, estado, nota, idProyecto } = req.body;

    try {
        // Actualizar la tarea
        const tarea = await PruebaModel.update(
            {
                estado,
                nota
            },
            {
                where: { id: idPrueba }
            }
        );

        if (tarea[0] > 0) { 
            const [results] = await db.query(`
                    SELECT 
                    p.id AS idProyecto, 
                    p.nombreProyecto, 
                    p.descripcion,
                    COUNT(CASE WHEN t.estado = 4 THEN 1 END) * 100.0 / NULLIF(COUNT(t.id), 0) AS porcentaje_desarrollo
                FROM GestorProyectos.proyecto p
                JOIN GestorProyectos.asigProyectoQA apd ON p.id = apd.idProyecto
                JOIN GestorProyectos.usuario u ON apd.idUsuario = u.id
                LEFT JOIN GestorProyectos.prueba t ON p.id = t.idProyecto AND apd.idUsuario = t.idUsuario
                WHERE u.id=`+ usuario + ` and p.id=` + idProyecto + `
                GROUP BY p.id, p.nombreProyecto, p.descripcion;
            `);

            res.json(results);
        } else {
            res.status(500).json({ message: "No se encontró la prueba para actualizar o no se realizaron cambios." });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const updateMetricas = async (req, res) => {
    const { idMetrica, tipo, valor } = req.body;

    try {
        const metrica = await MetricaModel.update(
            {
                [tipo]: valor
            },
            {
                where: { id: idMetrica }
            }
        );

        res.json(metrica);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


export const proyectoIns = async (req, res) => {
    const { nombreProyecto, descripcionProyecto, usuarioDesarrolloArray, usuarioCalidadArray, tareaArray, pruebaArray, metricaArray } = req.body;

    try {

        const proyecto = await ProyectoModel.create({
            nombreProyecto,
            descripcion: descripcionProyecto,
            fechaCreacion: new Date()
        })
        const proyectoUsuarioD = usuarioDesarrolloArray.map(id => ({
            idProyecto: proyecto.id,
            idUsuario: id,
            fechaCreacion: new Date()
        }));

        const proyectoUsuarioQA = usuarioCalidadArray.map(id => ({
            idProyecto: proyecto.id,
            idUsuario: id,
            fechaCreacion: new Date()
        }));

        const tareas = tareaArray.map(tarea => ({
            nombreTarea: tarea.nombreTarea,
            descripcion: tarea.descripcionTarea,
            idProyecto: proyecto.id,
            idUsuario: tarea.usuarioAsignado.id,
            fechaCreacion: new Date()
        }));

        const pruebas = pruebaArray.map(prueba => ({
            nombrePrueba: prueba.nombrePrueba,
            descripcion: prueba.descripcionPrueba,
            idProyecto: proyecto.id,
            idUsuario: prueba.usuarioAsignado.id,
            fechaCreacion: new Date()
        }));

        const metricas = metricaArray.map(metrica => ({
            nombreMetrica: metrica.nombreMetrica,
            descripcion: metrica.descripcionMetrica,
            idProyecto: proyecto.id,
            idUsuario: metrica.usuarioAsignado.id,
            fechaCreacion: new Date()
        }));

        await ProyectoUsuarioModelD.bulkCreate(proyectoUsuarioD);
        await ProyectoUsuarioModelQA.bulkCreate(proyectoUsuarioQA);
        await TareaModel.bulkCreate(tareas);
        await PruebaModel.bulkCreate(pruebas);
        await MetricaModel.bulkCreate(metricas);

        const [results] = await db.query(`
            WITH Desarrollo AS (
                SELECT 
                    p.id AS idProyecto, 
                    p.nombreProyecto, 
                    p.descripcion,
                    GROUP_CONCAT(DISTINCT u.nombre SEPARATOR ', ') AS usuarios_desarrollo, 
                    COUNT(CASE WHEN t.estado = 4 THEN 1 END) * 100.0 / NULLIF(COUNT(t.id), 0) AS porcentaje_desarrollo
                FROM GestorProyectos.proyecto p
                JOIN GestorProyectos.asigProyectoDesarrollo apd ON p.id = apd.idProyecto
                JOIN GestorProyectos.usuario u ON apd.idUsuario = u.id
                LEFT JOIN GestorProyectos.tarea t ON p.id = t.idProyecto AND apd.idUsuario = t.idUsuario
                GROUP BY p.id, p.nombreProyecto, p.descripcion
            ),
            Calidad AS (
                SELECT 
                    p.id AS idProyecto, 
                    GROUP_CONCAT(DISTINCT u.nombre SEPARATOR ', ') AS usuarios_calidad, 
                    COUNT(CASE WHEN t.estado = 4 THEN 1 END) * 100.0 / NULLIF(COUNT(t.id), 0) AS porcentaje_calidad
                FROM GestorProyectos.proyecto p
                JOIN GestorProyectos.asigProyectoQA apq ON p.id = apq.idProyecto
                JOIN GestorProyectos.usuario u ON apq.idUsuario = u.id
                LEFT JOIN GestorProyectos.prueba t ON p.id = t.idProyecto AND apq.idUsuario = t.idUsuario
                GROUP BY p.id
            )
            SELECT 
                d.idProyecto, 
                d.nombreProyecto AS nombre, 
                d.descripcion, 
                d.usuarios_desarrollo, 
                d.porcentaje_desarrollo, 
                c.usuarios_calidad, 
                c.porcentaje_calidad
            FROM Desarrollo d
            LEFT JOIN Calidad c ON d.idProyecto = c.idProyecto
            WHERE d.idProyecto=`+ proyecto.id + `;
        `);

        res.json(results);


    } catch (error) {
        console.error('Error en proyectoIns:', error);
        res.status(500).json({
            message: 'Error al crear el proyecto',
            error: error.message
        });
    }
};

