import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();
const PORT = process.env.PORT;

// Obtener la ruta del archivo actual
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ajuste para importar módulos correctamente
import('./database/db.js').then((dbModule) => {
    const db = dbModule.default;

    const app = express();

    // Importar rutas usando import dinámico
    import('./routes/routes.js').then((routesModule) => {
        const proyectoRoutes = routesModule.default;
        
        app.use(cors());
        app.use(express.json());
        app.use('/', proyectoRoutes);

        try {
            db.authenticate();
            console.log('Conexion exitosa a la db');
        } catch (error) {
            console.log(`Error de conexion: ${error}`);
        }

        app.get('/', (req, res) => {
            res.send('Hola mundo!');
        });

        app.listen(PORT, () => {
            console.log('APLICACION CORRIENDO EN EL PUERTO: ' + PORT);
        });
    }).catch(err => {
        console.error('Error al importar las rutas:', err);
    });
}).catch(err => {
    console.error('Error al importar la base de datos:', err);
});
