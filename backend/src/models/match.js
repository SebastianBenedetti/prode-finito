import { DataTypes } from "sequelize";
import sequelize from "../db.js";

const Match = sequelize.define("Match", {
  phase: {
    // "Grupos", "Octavos", "Cuartos", "Semifinal", "Final"
    type: DataTypes.STRING,
    allowNull: false,
  },
  group: {
    // "A", "B", ... null para fases eliminatorias
    type: DataTypes.STRING,
    allowNull: true,
  },
  homeTeam: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  awayTeam: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  homeFlag: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  awayFlag: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  matchDate: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  homeScore: {
    // null = no jugado aún
    type: DataTypes.INTEGER,
    allowNull: true,
    defaultValue: null,
  },
  awayScore: {
    type: DataTypes.INTEGER,
    allowNull: true,
    defaultValue: null,
  },
  played: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  matchOrder: {
    // para ordenar dentro de cada fase
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
});

export default Match;