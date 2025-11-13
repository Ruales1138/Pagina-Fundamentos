// StudentReports.js - Componente para que el estudiante suba informes de monitoria
import React, { useState, useEffect } from "react";
import style from "./StudentReports.module.css";

export default function StudentReports() {
  const [assignments, setAssignments] = useState([]);
  const [selectedAssignment, setSelectedAssignment] = useState("");
  const [fecha, setFecha] = useState("");
  const [horasReportadas, setHorasReportadas] = useState("");
  const [comentarios, setComentarios] = useState("");
  const [desempeño, setDesempeño] = useState("bueno");
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  // Cargar asignaciones del estudiante
  useEffect(() => {
    loadMyAssignments();
    loadMyReports();
  }, []);

  const loadMyAssignments = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const res = await fetch("http://localhost:3001/api/assignments", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) {
        const myAssignments = Array.isArray(data.assignments) ? data.assignments : [];
        setAssignments(myAssignments);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const loadMyReports = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const res = await fetch("http://localhost:3001/api/reports", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) {
        setReports(Array.isArray(data.reports) ? data.reports : []);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage("");

    if (!selectedAssignment || !horasReportadas || !comentarios) {
      setMessage("⚠️ Por favor completa todos los campos obligatorios");
      setSubmitting(false);
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      alert("Debes iniciar sesión");
      return;
    }

    try {
      const payload = {
        assignmentId: parseInt(selectedAssignment),
        fecha: fecha || new Date().toISOString().split("T")[0],
        horasReportadas: parseInt(horasReportadas),
        comentarios,
        desempeño,
      };

      const res = await fetch("http://localhost:3001/api/reports", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Error al registrar informe");

      setMessage("✅ Informe registrado exitosamente");
      setSelectedAssignment("");
      setFecha("");
      setHorasReportadas("");
      setComentarios("");
      setDesempeño("bueno");
      loadMyReports(); // Recargar lista
    } catch (err) {
      console.error(err);
      setMessage("❌ " + (err.message || "Error al registrar informe"));
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <section id="informes" className={style.container}>
        <h2>📊 Mis Informes de Monitoría</h2>
        <p>Cargando...</p>
      </section>
    );
  }

  if (assignments.length === 0) {
    return (
      <section id="informes" className={style.container}>
        <h2>📊 Mis Informes de Monitoría</h2>
        <div className={style.emptyState}>
          <p>📭 No tienes asignaciones activas como monitor.</p>
          <p>Cuando seas seleccionado para una monitoría, podrás subir tus informes aquí.</p>
        </div>
      </section>
    );
  }

  return (
    <section id="informes" className={style.container}>
      <h2>📊 Mis Informes de Monitoría</h2>

      {/* Formulario para subir informe */}
      <div className={style.formCard}>
        <h3>📝 Subir Nuevo Informe</h3>
        <form onSubmit={handleSubmit}>
          <div className={style.formGroup}>
            <label>Monitoría *</label>
            <select
              value={selectedAssignment}
              onChange={(e) => setSelectedAssignment(e.target.value)}
              required
            >
              <option value="">Selecciona una monitoría</option>
              {assignments.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.convocatoria?.titulo || `Monitoría #${a.id}`} - {a.horasAsignadas}h/semana
                </option>
              ))}
            </select>
          </div>

          <div className={style.formRow}>
            <div className={style.formGroup}>
              <label>Fecha del informe</label>
              <input
                type="date"
                value={fecha}
                onChange={(e) => setFecha(e.target.value)}
              />
            </div>

            <div className={style.formGroup}>
              <label>Horas reportadas *</label>
              <input
                type="number"
                value={horasReportadas}
                onChange={(e) => setHorasReportadas(e.target.value)}
                min="1"
                required
              />
            </div>
          </div>

          <div className={style.formGroup}>
            <label>Actividades realizadas *</label>
            <textarea
              value={comentarios}
              onChange={(e) => setComentarios(e.target.value)}
              placeholder="Describe las actividades que realizaste durante este período (tutorías, preparación de material, apoyo en laboratorio, etc.)"
              rows="5"
              required
            />
          </div>

          <div className={style.formGroup}>
            <label>Autoevaluación</label>
            <select value={desempeño} onChange={(e) => setDesempeño(e.target.value)}>
              <option value="bueno">Bueno</option>
              <option value="regular">Regular</option>
              <option value="bajo">Bajo</option>
            </select>
          </div>

          {message && (
            <div className={message.includes("✅") ? style.successMsg : style.errorMsg}>
              {message}
            </div>
          )}

          <button type="submit" disabled={submitting} className={style.submitBtn}>
            {submitting ? "Enviando..." : "📤 Enviar Informe"}
          </button>
        </form>
      </div>

      {/* Lista de informes enviados */}
      <div className={style.reportsCard}>
        <h3>📋 Historial de Informes</h3>
        {reports.length === 0 ? (
          <p className={style.emptyText}>No has enviado informes aún.</p>
        ) : (
          <div className={style.reportsList}>
            {reports.map((report) => (
              <div key={report.id} className={style.reportItem}>
                <div className={style.reportHeader}>
                  <span className={style.reportDate}>
                    📅 {new Date(report.fecha).toLocaleDateString("es-ES")}
                  </span>
                  <span className={`${style.badge} ${style[report.desempeño]}`}>
                    {report.desempeño}
                  </span>
                </div>
                <p className={style.reportTitle}>
                  <strong>Monitoría:</strong> {report.assignment?.convocatoria?.titulo || "N/A"}
                </p>
                <p className={style.reportHours}>
                  <strong>Horas reportadas:</strong> {report.horasReportadas}h
                </p>
                <p className={style.reportComments}>{report.comentarios}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
