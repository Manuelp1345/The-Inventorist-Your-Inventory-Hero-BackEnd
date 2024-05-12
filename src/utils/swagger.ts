import swaggerJSDoc from "swagger-jsdoc";
import { PORT } from "./contants";

const swaggerDefinition = {
  openapi: "3.0.0",
  info: {
    title: "API Documentation",
    version: "1.0.0",
    description: "API Documentation",
  },
  servers: [
    {
      url: `http://localhost:${PORT}`,
      description: "Development server",
    },
    {
      url: "https://the-inventorist-your-inventory-hero.onrender.com/",
      description: "Production server",
    },
  ],
};

const options = {
  swaggerDefinition,
  apis: ["./src/modules/**/*.ts"],
};

const swaggerSpec = swaggerJSDoc(options);

export default swaggerSpec;
