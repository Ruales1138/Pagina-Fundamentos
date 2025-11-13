// src/models/Assignment.js
const { DataTypes } = require("sequelize");
const { sequelize } = require("../db");
const Application = require("./Application");
const User = require("./User");
const Convocatoria = require("./Convocatoria");

const Assignment = sequelize.define(
  "Assignment",
  {
    horasAsignadas: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    semestre: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    estado: {
      type: DataTypes.ENUM("activa", "finalizada"),
      defaultValue: "activa",
    },
    convocatoriaId: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
  },
  { tableName: "assignments", timestamps: true }
);

Assignment.belongsTo(Application, { as: "application", foreignKey: "applicationId" });
Application.hasOne(Assignment, { as: "assignment", foreignKey: "applicationId" });

Assignment.belongsTo(User, { as: "docente", foreignKey: "docenteId" });
User.hasMany(Assignment, { as: "docenteAsignaciones", foreignKey: "docenteId" });

Assignment.belongsTo(User, { as: "estudiante", foreignKey: "estudianteId" });
User.hasMany(Assignment, { as: "estudianteAsignaciones", foreignKey: "estudianteId" });

Assignment.belongsTo(Convocatoria, { as: "convocatoria", foreignKey: "convocatoriaId" });
Convocatoria.hasMany(Assignment, { as: "assignments", foreignKey: "convocatoriaId" });

module.exports = Assignment;
