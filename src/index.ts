import express, { Request, Response } from "express";
import swaggerUi from "swagger-ui-express";
import { logRequestDetails } from "./middleware/logger";
import { connectToDatabase } from "./utils/db";
import { PORT } from "./utils/contants";
import router from "./routes";
import "reflect-metadata";
import swaggerSpec from "./utils/swagger";

const app = express();
const port = PORT;

app.get("/", (req: Request, res: Response) => {
  res.send("Hola Mundo!");
});

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use(express.json({ limit: "50mb" }));
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
