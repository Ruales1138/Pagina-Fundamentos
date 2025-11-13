// src/routes/alerts.js
const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const { getNotifications, markAsRead, markAllAsRead } = require("../controllers/alertController");

// Obtener notificaciones del usuario
router.get("/", auth, getNotifications);

// Marcar una notificación como leída
router.patch("/:id/read", auth, markAsRead);

// Marcar todas como leídas
router.post("/read-all", auth, markAllAsRead);

module.exports = router;
