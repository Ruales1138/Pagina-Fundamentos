-- Script para resetear completamente la base de datos
-- Elimina todas las tablas y deja que Sequelize las recree

-- Eliminar todas las tablas
DROP TABLE IF EXISTS monitoring_reports CASCADE;
DROP TABLE IF EXISTS notifications CASCADE;
DROP TABLE IF EXISTS assignments CASCADE;
DROP TABLE IF EXISTS applications CASCADE;
DROP TABLE IF EXISTS convocatorias CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- Mensaje de confirmación
SELECT 'Base de datos reseteada exitosamente. Las tablas serán recreadas al iniciar el servidor.' AS resultado;
