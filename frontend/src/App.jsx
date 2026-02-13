import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import PlantsPage from "./pages/PlantsPage";
import DepartmentsPage from "./pages/DepartmentsPage";
import CostCentersPage from "./pages/CostCentersPage";
import WorkCentersPage from "./pages/WorkCentersPage";

export default function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<PlantsPage />} />
          <Route path="/departments" element={<DepartmentsPage />} />
          <Route path="/cost-centers" element={<CostCentersPage />} />
          <Route path="/work-centers" element={<WorkCentersPage />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}
