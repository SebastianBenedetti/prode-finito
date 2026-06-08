import { DataTypes } from "sequelize";
import sequelize from "../db.js";

const Prediction = sequelize.define("Prediction", {
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  matchId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  homeScore: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  awayScore: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  points: {
    // calculado automáticamente cuando se carga el resultado real
    type: DataTypes.INTEGER,
    defaultValue: null,
    allowNull: true,
  },
});

export default Prediction;