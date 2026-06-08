import { Sequelize } from "sequelize";

const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: "./database.sqlite",
  logging: false,
  define: {
    charset: "utf8",
  },
});

export default sequelize;
