
import express from "express";
import cors from "cors";


import plantRoutes from "./routes/plant.routes.js";
import departmentRoutes from "./routes/department.routes.js";
import costCenterRoutes from "./routes/costCenter.routes.js";
import workCenterRoutes from "./routes/workCenter.routes.js";

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "API is running",
  });
});


app.use("/api/plants", plantRoutes);
app.use("/api/departments", departmentRoutes);
app.use("/api/cost-centers", costCenterRoutes);
app.use("/api/work-centers", workCenterRoutes);

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});


app.use((err, req, res, next) => {
  console.error("Global Error:", err);

  res.status(500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

 
const PORT = process.env.PORT ;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
