import { Route, Routes } from "react-router-dom";

import AppLayout from "./layouts/AppLayout";
import MainPage from "./pages/MainPage";

function App() {
  return (
    <>
      <Routes>
        <Route element={<AppLayout />}>
          <Route path="/" element={<MainPage />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
