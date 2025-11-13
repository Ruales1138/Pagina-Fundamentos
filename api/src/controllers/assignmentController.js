// src/controllers/assignmentController.js
const Assignment = require("../models/Assignment");
const Application = require("../models/Application");

async function createAssignment(req, res) {
  try {
    const { applicationId, horasAsignadas, semestre } = req.body;
    const app = await Application.findByPk(applicationId, { include: [{ association: "convocatoria" }, { association: "estudiante" }] });
    if (!app) return res.status(404).json({ ok: false, message: "Postulación no encontrada" });

    // only docente owner can assign
    if (req.user.role !== "Docente" || app.convocatoria.docenteId !== req.user.id) {
      return res.status(403).json({ ok: false, message: "No autorizado" });
    }

    const assignment = await Assignment.create({ 
      applicationId, 
      horasAsignadas, 
      semestre, 
      docenteId: req.user.id,
      estudianteId: app.estudianteId,
      convocatoriaId: app.convocatoriaId
    });
    return res.status(201).json({ ok: true, assignment });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ ok: false, message: "Error del servidor" });
  }
}

async function listAssignments(req, res) {
  try {
    const where = {};
    if (req.user.role === "Docente") where.docenteId = req.user.id;
    const list = await Assignment.findAll({ include: [
      { association: "application", include: ["convocatoria", "estudiante"] },
      { association: "docente", attributes: ["id", "username"] }
    ]});
    return res.json({ ok: true, assignments: list });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ ok: false, message: "Error del servidor" });
  }
}

module.exports = { createAssignment, listAssignments };
