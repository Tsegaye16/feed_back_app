const { Sequelize } = require("sequelize");

const sequelize = new Sequelize("sample", "postgres", "Amare_Abewa12", {
  host: "localhost",
  port: 2123,
  dialect: "postgres",
  loging: true,
});
const connects = async () => {
  try {
    await sequelize.authenticate();
    console.log("Connection has been established successfully.");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
};

export { connects };
