import React, { useState, useEffect } from "react";
import style from "./Alerts.module.css";

export default function Alerts() {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNotifications();
    // Actualizar cada 30 segundos
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchNotifications = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const response = await fetch("http://localhost:3001/api/alerts?limit=5", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await response.json();
      if (data.ok) {
        setNotifications(data.notifications);
        setUnreadCount(data.unreadCount);
      }
    } catch (err) {
      console.error("Error fetching notifications:", err);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`http://localhost:3001/api/alerts/${id}/read`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        fetchNotifications(); // Refrescar
      }
    } catch (err) {
      console.error("Error marking as read:", err);
    }
  };

  const markAllAsRead = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:3001/api/alerts/read-all", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        fetchNotifications();
      }
    } catch (err) {
      console.error("Error marking all as read:", err);
    }
  };

  const getIcon = (type) => {
    switch (type) {
      case 'nueva_aplicacion':
        return '📬';
      case 'estado_cambiado':
        return '🔔';
      case 'asignacion':
        return '🎓';
      case 'nueva_convocatoria':
        return '📢';
      default:
        return '📌';
    }
  };

  if (loading) {
    return (
      <section id="alertas">
        <h2>Alertas</h2>
        <p style={{ textAlign: 'center', color: '#666' }}>Cargando notificaciones...</p>
      </section>
    );
  }

  return (
    <section id="alertas">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2>
          Alertas {unreadCount > 0 && <span className={style.badge}>{unreadCount}</span>}
        </h2>
        {unreadCount > 0 && (
          <button onClick={markAllAsRead} className={style.markAllBtn}>
            Marcar todas como leídas
          </button>
        )}
      </div>

      <div className={style.alertsContainer}>
        {notifications.length === 0 ? (
          <div className={style.emptyState}>
            <p>✅ No tienes notificaciones nuevas</p>
          </div>
        ) : (
          notifications.map((notif) => (
            <div
              key={notif.id}
              className={`${style.alertBox} ${notif.read ? style.read : style.unread}`}
              onClick={() => !notif.read && markAsRead(notif.id)}
            >
              <div className={style.alertIcon}>{getIcon(notif.type)}</div>
              <div className={style.alertText}>
                <p>{notif.message}</p>
                <small>{new Date(notif.createdAt).toLocaleString('es-ES')}</small>
              </div>
              {!notif.read && <div className={style.unreadDot}></div>}
            </div>
          ))
        )}
      </div>
    </section>
  );
}
