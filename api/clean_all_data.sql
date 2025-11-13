-- Limpiar todos los datos de todas las tablas
-- Se debe ejecutar en el orden correcto para respetar las foreign keys

-- 1. Eliminar datos de tablas que dependen de otras
TRUNCATE TABLE monitoring_reports CASCADE;
TRUNCATE TABLE notifications CASCADE;
TRUNCATE TABLE assignments CASCADE;
TRUNCATE TABLE applications CASCADE;

-- 2. Eliminar datos de tablas independientes
TRUNCATE TABLE convocatorias CASCADE;
TRUNCATE TABLE users CASCADE;

-- Mensaje de confirmación
SELECT 'Todos los datos han sido eliminados exitosamente' AS resultado;
