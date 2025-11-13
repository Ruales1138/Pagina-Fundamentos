// src/controllers/applicationController.js
const Application = require("../models/Application");
const Convocatoria = require("../models/Convocatoria");
const { Op } = require("sequelize");
const { analyzeCVWithAI } = require("../services/aiService");
const { createNotification } = require("./alertController");

async function applyToConvocatoria(req, res) {
  try {
    const { convocatoriaId, perfilTexto } = req.body;

    const convocatoria = await Convocatoria.findByPk(convocatoriaId);
    if (!convocatoria || convocatoria.estado !== "publicada") {
      return res.status(404).json({ ok: false, message: "Convocatoria no disponible" });
    }

    // prevent duplicate application by same student
    const existing = await Application.findOne({ where: { estudianteId: req.user.id, convocatoriaId } });
    if (existing) return res.status(409).json({ ok: false, message: "Ya aplicaste a esta convocatoria" });

    const cvPath = req.file ? `/uploads/${req.file.filename}` : null;
    
    // 🤖 ANÁLISIS CON IA: Analizar CV y perfil con GPT-4
    console.log("🤖 Analizando CV con IA...");
    const score = await analyzeCVWithAI(
      perfilTexto,
      cvPath,
      convocatoria.requisitos,
      convocatoria.habilidadesRequeridas
    );
    console.log(`✅ Score calculado: ${score}%`);

    const application = await Application.create({
      estudianteId: req.user.id,
      convocatoriaId,
      perfilTexto,
      cvPath,
      score,
      estado: "postulada",
    });

    // 🔔 Notificar al docente de la nueva aplicación
    console.log(`🔔 Notificando al docente ID: ${convocatoria.docenteId} sobre nueva aplicación`);
    await createNotification(
      convocatoria.docenteId,
      'nueva_aplicacion',
      `📬 Nueva aplicación a "${convocatoria.titulo}" - Score: ${score}%`,
      application.id,
      'application'
    );
    console.log("✅ Notificación de aplicación enviada");

    return res.status(201).json({ ok: true, application, score });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ ok: false, message: "Error del servidor" });
  }
}

async function listApplications(req, res) {
  try {
    const { convocatoriaId, estado } = req.query;
    const where = {};
    if (convocatoriaId) where.convocatoriaId = convocatoriaId;
    if (estado) where.estado = estado;

    // docentes ven todas de su convocatoria; estudiantes sólo las propias
    if (req.user.role !== "Docente") {
      where.estudianteId = req.user.id;
    }

    const apps = await Application.findAll({
      where,
      include: [
        { association: "convocatoria" },
        { association: "estudiante", attributes: ["id", "username", "role"] },
      ],
      order: [["createdAt", "DESC"]],
    });
    return res.json({ ok: true, applications: apps });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ ok: false, message: "Error del servidor" });
  }
}

async function updateApplicationStatus(req, res) {
  try {
    const { id } = req.params;
    const { estado } = req.body; // preseleccionada, seleccionada, rechazada

    const app = await Application.findByPk(id, { include: [{ association: "convocatoria" }] });
    if (!app) return res.status(404).json({ ok: false, message: "Postulación no encontrada" });

    // only docente owner of convocatoria can change status
    if (req.user.role !== "Docente" || app.convocatoria.docenteId !== req.user.id) {
      return res.status(403).json({ ok: false, message: "No autorizado" });
    }

    const oldEstado = app.estado;
    app.estado = estado;
    await app.save();

    // 🔔 Notificar al estudiante del cambio de estado
    if (oldEstado !== estado) {
      let message = '';
      let emoji = '';
      
      switch (estado) {
        case 'preseleccionada':
          emoji = '🎯';
          message = `${emoji} ¡Fuiste preseleccionado/a para "${app.convocatoria.titulo}"!`;
          break;
        case 'seleccionada':
          emoji = '🎉';
          message = `${emoji} ¡Felicidades! Fuiste seleccionado/a para "${app.convocatoria.titulo}"`;
          break;
        case 'rechazada':
          emoji = '📋';
          message = `${emoji} Tu aplicación a "${app.convocatoria.titulo}" no fue seleccionada esta vez`;
          break;
        default:
          message = `Tu aplicación a "${app.convocatoria.titulo}" cambió de estado a: ${estado}`;
      }

      await createNotification(
        app.estudianteId,
        'estado_cambiado',
        message,
        app.id,
        'application'
      );
    }

    return res.json({ ok: true, application: app });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ ok: false, message: "Error del servidor" });
  }
}

/**
 * 🤖 Recalcular score de una aplicación usando IA
 * Solo para docentes que sean dueños de la convocatoria
 */
async function recalculateScoreWithAI(req, res) {
  try {
    const { id } = req.params;

    const app = await Application.findByPk(id, { 
      include: [{ association: "convocatoria" }] 
    });
    
    if (!app) {
      return res.status(404).json({ ok: false, message: "Postulación no encontrada" });
    }

    // Verificar que el docente sea dueño de la convocatoria
    if (app.convocatoria.docenteId !== req.user.id) {
      return res.status(403).json({ ok: false, message: "No autorizado" });
    }

    console.log(`🤖 Recalculando score con IA para aplicación ${id}...`);
    
    // Calcular nuevo score con IA
    const newScore = await analyzeCVWithAI(
      app.perfilTexto,
      app.cvPath,
      app.convocatoria.requisitos,
      app.convocatoria.habilidadesRequeridas
    );

    const oldScore = app.score;
    app.score = newScore;
    await app.save();

    console.log(`✅ Score actualizado: ${oldScore}% → ${newScore}%`);

    return res.json({ 
      ok: true, 
      message: "Score recalculado con IA",
      oldScore,
      newScore,
      application: app 
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ ok: false, message: "Error del servidor" });
  }
}

module.exports = { 
  applyToConvocatoria, 
  listApplications, 
  updateApplicationStatus,
  recalculateScoreWithAI 
};
