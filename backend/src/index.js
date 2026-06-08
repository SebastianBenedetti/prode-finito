import "dotenv/config";
import express from "express";
import morgan from "morgan";
import cors from "cors";
import sequelize from "./db.js";
import "./models/relations.js";

import authRoutes from "./routes/auth.routes.js";
import matchRoutes from "./routes/match.routes.js";
import predictionRoutes from "./routes/prediction.routes.js";
import userRoutes from "./routes/user.routes.js";

import { seedUsers } from "./services/user.service.js";
import { seedMatches } from "./services/match.service.js";

const app = express();

app.use(morgan("dev"));
app.use(cors());
app.use(express.json());

app.use("/auth", authRoutes);
app.use("/matches", matchRoutes);
app.use("/predictions", predictionRoutes);
app.use("/users", userRoutes);

app.get("/", (req, res) => res.send("Prode Mundial 2026 API andando 🏆"));

const PORT = process.env.PORT || 3000;

const start = async () => {
  await sequelize.sync();
  await seedUsers(); // Carga usuario1..4 si no existen
  await seedMatches(); // Carga el fixture si no existe
  app.listen(PORT, () => console.log(`Server en http://localhost:${PORT}`));
};

start();
