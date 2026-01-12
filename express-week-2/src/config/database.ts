import { DataSource } from "typeorm";
import dotenv from "./dotenv";
import { User } from "../models/user.entities";

const AppSource = new DataSource({
  type: 'postgres',
  host: dotenv.DB_HOST,
  port: +dotenv.DB_PORT,
  username: dotenv.DB_USERNAME,
  password: dotenv.DB_PASSWORD,
  database: dotenv.DB_NAME,
  entities: [User],
  synchronize: true,
  logging: false
});

export default AppSource;