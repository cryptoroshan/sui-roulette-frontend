import { Route, Routes } from "react-router-dom";
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

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
      <ToastContainer
        position='top-center'
        autoClose={2000}
        hideProgressBar
        pauseOnHover={false}
        pauseOnFocusLoss={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        theme='dark'
      />
    </>
  );
}

export default App;
