// src/controllers/convocatoriaController.js
const Convocatoria = require("../models/Convocatoria");
const User = require("../models/User");
const { createNotification } = require("./alertController");

// Crear convocatoria
async function crearConvocatoria(req, res) {
  try {
    const { titulo, descripcion, materia, habilidadesRequeridas, numeroPuestos, requisitos, beneficios, fechaFin } = req.body;

    if (!titulo || !descripcion || !materia || !fechaFin) {
      return res.status(400).json({ ok: false, message: "Faltan campos obligatorios" });
    }

    const convocatoria = await Convocatoria.create({
      titulo,
      descripcion,
      materia,
      habilidadesRequeridas,
      numeroPuestos,
      requisitos,
      beneficios,
      fechaFin,
      docenteId: req.user.id,
    });

    // Notificar a todos los estudiantes sobre la nueva convocatoria
    console.log("🔔 Buscando estudiantes para notificar...");
    const estudiantes = await User.findAll({ where: { role: "Estudiante" } });
    console.log(`📊 Encontrados ${estudiantes.length} estudiantes`);
    
    for (const estudiante of estudiantes) {
      console.log(`📩 Notificando a estudiante ID: ${estudiante.id}`);
      await createNotification(
        estudiante.id,
        "nueva_convocatoria",
        `📢 Nueva convocatoria disponible: ${titulo}`,
        convocatoria.id,
        "convocatoria"
      );
    }

    console.log("✅ Convocatoria creada y notificaciones enviadas");
    return res.status(201).json({ ok: true, convocatoria });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ ok: false, message: "Error del servidor" });
  }
}

// Listar convocatorias
async function listarConvocatorias(req, res) {
  try {
    const convocatorias = await Convocatoria.findAll({
      include: [{ association: "docente", attributes: ["id", "username", "role"] }],
      order: [["createdAt", "DESC"]],
    });
    return res.json({ ok: true, convocatorias });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ ok: false, message: "Error del servidor" });
  }
}

// Cerrar convocatoria
async function cerrarConvocatoria(req, res) {
  try {
    const { id } = req.params;
    const convocatoria = await Convocatoria.findByPk(id);

    if (!convocatoria) {
      return res.status(404).json({ ok: false, message: "Convocatoria no encontrada" });
    }

    if (convocatoria.docenteId !== req.user.id) {
      return res.status(403).json({ ok: false, message: "No eres el creador de esta convocatoria" });
    }

    convocatoria.estado = "cerrada";
    await convocatoria.save();

    return res.json({ ok: true, convocatoria });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ ok: false, message: "Error del servidor" });
  }
}

// Exportamos las tres funciones
module.exports = { crearConvocatoria, listarConvocatorias, cerrarConvocatoria };