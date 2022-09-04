import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import "express-async-errors";

import routes from "./routes/routesIndex";
import errorHandler from "./middlewares/errorHandlerMiddleware";

dotenv.config();

const server = express();

server.use(cors());
server.use(express.json());
server.use(routes);
server.use(errorHandler);  

const PORT: number = Number(process.env.PORT);
 
server.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}!`);
});