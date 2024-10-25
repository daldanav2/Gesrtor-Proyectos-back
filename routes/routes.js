import express from 'express'
import { getAllProyects, getProyectByUserD, getProyectByUserQA, getProyectDetalle, getProyectDetalleByUserD, getProyectDetalleByUserQA, proyectoIns, updateMetricas, updateStatusNotePrueba, updateStatusNoteTarea } from '../controllers/ProyectoController.js'
import { activeUsuario, createUsuario, deleteUsuario, getAllUsers, getAllUsersD, getAllUsersQA, getUsuario, updateUsuario,uploadAvatar } from '../controllers/UsuaroController.js'
import { activeRol, createRol, deleteRol, getAllRols, getRol, updateRol } from '../controllers/RolController.js'
import { getAllTares } from '../controllers/TareaController.js'
import { createEstado, getAllEstados, getEstado, updateEstado, deleteEstado, activeEstado} from '../controllers/EstadoController.js'
import { createMenuRol, deleteMenuRol, getMenuRol } from '../controllers/MenuRolController.js'
import { getUsurioRol, createUsurioRol, deleteUsuarioRol, getMenusByUsuario } from '../controllers/UsuarioRolController.js'
import { Login } from '../controllers/LoginController.js'
import { createMenu, getAllMenu, getMenu, updateMenu, deleteMenu, activeMenu, getPadre, getHijo } from '../controllers/MenuController.js'
import { inspect } from 'util'

const router = express.Router()
//api para menu
router.get('/Menu', getAllMenu)
router.get('/Menu/dad', getPadre)
router.get('/Menu/son', getHijo)
router.get('/Menu/:id', getMenu)
router.post('/Menu/Crear',createMenu)
router.post('/Menu/Modificar/:id',updateMenu)
router.post('/Menu/Eliminar/:id',deleteMenu)
router.post('/Menu/Activar/:id',activeMenu)
//api Menu Rol
router.get('/MenuRol/:id',getMenuRol)
router.post('/MenuRol/Eliminar/',deleteMenuRol)
router.post('/MenuRol/Crear',createMenuRol)
router.post('/MenuRol/CargarMenu', getMenusByUsuario)

//api Usuario Rol
router.get('/UsuarioRol/:id',getUsurioRol)
router.post('/UsuarioRol/Eliminar/:id',deleteUsuarioRol)
router.post('/UsuarioRol/Crear',createUsurioRol)

//api Usuarios
router.get('/Usuarios',getAllUsers)
router.get('/Usuarios/Calidad',getAllUsersQA)
router.get('/Usuarios/Desarrollo',getAllUsersD)
router.get('/Usuarios/:id',getUsuario)
router.post('/Usuarios/Modificar/', uploadAvatar, updateUsuario)
router.post('/Usuarios/Eliminar/',deleteUsuario)
router.post('/Usuarios/Activar/',activeUsuario)
router.post("/Usuarios/Crear", uploadAvatar, createUsuario);

router.get('/Proyectos',getAllProyects)
router.post('/Proyectos/crear',proyectoIns)
router.post('/Proyectos/ActualizarMetricas',updateMetricas)
router.post('/Proyectos/usuarioDProyecto',getProyectByUserD)
router.post('/Proyectos/proyectoDetalleD',getProyectDetalleByUserD)
router.post('/Proyectos/proyectoDetalle',getProyectDetalle)
router.post('/Proyectos/proyectoDetalleQA',getProyectDetalleByUserQA)
router.post('/Proyectos/usuarioQAProyecto',getProyectByUserQA)
router.post('/Proyectos/ActualizarEstadoTarea',updateStatusNoteTarea)
router.post('/Proyectos/ActualizarEstadoPrueba',updateStatusNotePrueba)


router.get('/Tareas',getAllTares)

//api para estados
router.get('/Estados',getAllEstados)
router.get('/Estados/:id',getEstado)
router.post('/Estados/Modificar/:id',updateEstado)
router.post('/Estados/Eliminar/',deleteEstado)
router.post('/Estados/Activar/',activeEstado)
router.post('/Estados/Crear',createEstado)



//api para rol
router.get('/Roles',getAllRols)
router.get('/Roles/:id',getRol)
router.post('/Roles/Crear',createRol)
router.post('/Roles/Modificar',updateRol)
router.post('/Roles/Eliminar/',deleteRol)
router.post('/Roles/Activar/',activeRol)

//api para login
router.post('/Login',Login);
export default router