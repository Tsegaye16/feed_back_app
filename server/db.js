import { Sequelize } from "sequelize";
import dotenv from "dotenv";

dotenv.config({ path: "./.env" });
export const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER, //|| "feed_back_user",
  process.env.DB_PASSWORD,

  {
    host: process.env.DB_HOST, // Just the hostname (without the 'postgresql://')
    port: process.env.DB_PORT || 5432,
    dialect: "postgres",
    logging: false,
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
    },
  }
);
