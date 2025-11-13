// src/controllers/alertController.js
const { Op } = require("sequelize");
const Notification = require("../models/Notification");
const User = require("../models/User");

/**
 * 🔔 Obtener notificaciones del usuario actual
 */
async function getNotifications(req, res) {
  try {
    const { limit = 10, unreadOnly = false } = req.query;
    
    const where = { userId: req.user.id };
    if (unreadOnly === 'true') {
      where.read = false;
    }

    const notifications = await Notification.findAll({
      where,
      order: [['createdAt', 'DESC']],
      limit: parseInt(limit),
    });

    const unreadCount = await Notification.count({
      where: { userId: req.user.id, read: false },
    });

    return res.json({ 
      ok: true, 
      notifications,
      unreadCount,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ ok: false, message: "Error del servidor" });
  }
}

/**
 * ✅ Marcar notificación como leída
 */
async function markAsRead(req, res) {
  try {
    const { id } = req.params;

    const notification = await Notification.findByPk(id);
    if (!notification) {
      return res.status(404).json({ ok: false, message: "Notificación no encontrada" });
    }

    if (notification.userId !== req.user.id) {
      return res.status(403).json({ ok: false, message: "No autorizado" });
    }

    notification.read = true;
    await notification.save();

    return res.json({ ok: true, notification });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ ok: false, message: "Error del servidor" });
  }
}

/**
 * ✅ Marcar todas las notificaciones como leídas
 */
async function markAllAsRead(req, res) {
  try {
    await Notification.update(
      { read: true },
      { where: { userId: req.user.id, read: false } }
    );

    return res.json({ ok: true, message: "Todas las notificaciones marcadas como leídas" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ ok: false, message: "Error del servidor" });
  }
}

/**
 * 🔔 Crear notificación (función helper interna)
 * @param {number} userId - ID del usuario que recibirá la notificación
 * @param {string} type - Tipo de notificación
 * @param {string} message - Mensaje de la notificación
 * @param {number} relatedId - ID relacionado (opcional)
 * @param {string} relatedType - Tipo de entidad relacionada (opcional)
 */
async function createNotification(userId, type, message, relatedId = null, relatedType = null) {
  try {
    await Notification.create({
      userId,
      type,
      message,
      relatedId,
      relatedType,
      read: false,
    });
    console.log(`📩 Notificación creada para usuario ${userId}: ${message}`);
  } catch (err) {
    console.error("Error creando notificación:", err);
  }
}

module.exports = { 
  getNotifications, 
  markAsRead, 
  markAllAsRead,
  createNotification, // Exportar para usar en otros controladores
};
