import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "../pages/login";
import Dashboard from "../pages/selfDashboard";
import Layout from "../components/Layout";


const Router = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login setActivePage={function (): void {
          throw new Error("Function not implemented.");
        } } />} />

        {/* Layout wrapper */}
          <Route path="/dashboard" element={<Dashboard />} />
        <Route element={<Layout children={undefined} />}>
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default Router;