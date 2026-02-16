import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import PlantsPage from "./pages/PlantsPage";
import DepartmentsPage from "./pages/DepartmentsPage";
import CostCentersPage from "./pages/CostCentersPage";
import WorkCentersPage from "./pages/WorkCentersPage";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout title="Plant Management"><PlantsPage /></Layout>} />
        <Route path="/departments" element={<Layout title="Department Management"><DepartmentsPage /></Layout>} />
        <Route path="/cost-centers" element={<Layout title="Cost Center Management"><CostCentersPage /></Layout>} />
        <Route path="/work-centers" element={<Layout title="Work Center Management"><WorkCentersPage /></Layout>} />
      </Routes>
    </BrowserRouter>
  );
}
