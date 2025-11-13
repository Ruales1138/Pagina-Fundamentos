// src/controllers/reportController.js
const MonitoringReport = require("../models/MonitoringReport");
const Assignment = require("../models/Assignment");

async function createReport(req, res) {
  try {
    const { assignmentId, fecha, horasReportadas, comentarios, desempeño } = req.body;

    const assignment = await Assignment.findByPk(assignmentId, {
      include: [{ association: 'estudiante' }, { association: 'convocatoria' }]
    });
    if (!assignment) return res.status(404).json({ ok: false, message: "Asignación no encontrada" });

    // Permitir al docente dueño O al estudiante asignado crear reportes
    const isDocente = req.user.role === "Docente" && assignment.convocatoria.docenteId === req.user.id;
    const isEstudianteAsignado = req.user.role === "Estudiante" && assignment.estudianteId === req.user.id;

    if (!isDocente && !isEstudianteAsignado) {
      return res.status(403).json({ ok: false, message: "No autorizado para crear reportes en esta asignación" });
    }

    const report = await MonitoringReport.create({ 
      assignmentId, 
      fecha, 
      horasReportadas, 
      comentarios, 
      desempeño, 
      autorId: req.user.id 
    });
    
    console.log(`📝 Reporte creado por ${req.user.role}: ${req.user.username}`);
    return res.status(201).json({ ok: true, report });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ ok: false, message: "Error del servidor" });
  }
}

async function listReports(req, res) {
  try {
    const { assignmentId } = req.query;
    const where = {};
    if (assignmentId) where.assignmentId = assignmentId;

    const reports = await MonitoringReport.findAll({ where, include: [{ association: "assignment" }, { association: "autor", attributes: ["id", "username"] }] });
    return res.json({ ok: true, reports });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ ok: false, message: "Error del servidor" });
  }
}

module.exports = { createReport, listReports };
