import { Sequelize } from "sequelize";

const sequelize = new Sequelize("moneytracker", "root", "", {
  host: "localhost",
  dialect: "mysql",
  logging: false, // Set to console.log to see SQL queries
});

export default sequelize;
