import express, { Request, Response } from "express";
import router from "./routes";
import { logRequestDetails } from "./middleware/logger";
import "reflect-metadata";
import { connectToDatabase } from "./utils/db";

const app = express();
const port = 3000;

app.get("/", (req: Request, res: Response) => {
  res.send("Hola Mundo!");
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(logRequestDetails);
app.use(router);

app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
  connectToDatabase()
    .then(() => {
      console.log("Conectado a la base de datos");
    })
    .catch((error) => {
      console.error("Error al conectar a la base de datos", error);
    });
});
