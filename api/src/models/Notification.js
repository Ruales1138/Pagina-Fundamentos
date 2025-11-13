// src/models/Notification.js
const { DataTypes } = require('sequelize');
const { sequelize } = require('../db');

const Notification = sequelize.define('Notification', {
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id',
    },
  },
  type: {
    type: DataTypes.STRING,
    allowNull: false,
    // Tipos: 'nueva_aplicacion', 'estado_cambiado', 'asignacion', 'reporte_vencido'
  },
  message: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  read: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  relatedId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    comment: 'ID de aplicación, convocatoria, etc.',
  },
  relatedType: {
    type: DataTypes.STRING,
    allowNull: true,
    comment: 'application, convocatoria, assignment',
  },
}, {
  tableName: 'notifications',
  timestamps: true,
});

module.exports = Notification;
