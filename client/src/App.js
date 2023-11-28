import { BrowserRouter, Routes, Route } from "react-router-dom";

import UploadProducts from "./components/admin/UploadProducts/UploadProducts";
import ViewProducts from "./components/admin/ViewProducts/ViewProducts";
import AdminHome from "./components/admin/AdminHome/AdminHome";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route exact path="/" element={<AdminHome />} />
        <Route exact path="/upload-products" element={<UploadProducts />} />
        <Route exact path="/view-products" element={<ViewProducts />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
