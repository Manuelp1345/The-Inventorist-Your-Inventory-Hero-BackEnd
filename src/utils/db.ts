import { DataSource } from "typeorm";
import {
  DB_DATABASE,
  DB_HOST,
  DB_PASSWORD,
  DB_PORT,
  DB_TYPE,
  DB_USERNAME,
} from "./contants";
import { User } from "../entities/user.entity";
import { Product } from "../entities/product.entity";

export const connectToDatabase = async () => {
  const connection = new DataSource({
    type: "postgres",
    host: DB_HOST,
    port: Number(DB_PORT),
    username: DB_USERNAME,
    password: DB_PASSWORD,
    database: DB_DATABASE,
    entities: [User, Product],
    synchronize: true,
    logger: "advanced-console",
  });
  try {
    await connection.connect();
  } catch (error) {
    console.log("Error al conectar a la base de datos", error);
    throw new Error("Error al conectar a la base de datos");
  }
  if (connection.isInitialized) {
    return connection;
  }
  throw new Error("Error al conectar a la base de datos");
};
