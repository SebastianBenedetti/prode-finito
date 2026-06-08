import { DataTypes } from "sequelize";
import sequelize from "../db.js";
import { ROLES } from "../enums/enums.js";

const User = sequelize.define("User", {
  username: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  avatarUrl: {
    type: DataTypes.STRING,
    allowNull: true,
    defaultValue: null,
  },
  bio: {
    type: DataTypes.STRING(200),
    allowNull: true,
    defaultValue: null,
  },
  role: {
    type: DataTypes.ENUM(ROLES.USER, ROLES.ADMIN),
    allowNull: false,
    defaultValue: ROLES.USER,
  },
});

export default User;
