import { BrowserRouter, Route, Routes } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import DashboardPage from "../pages/DashboardPage";
import SignInPage from "../pages/SignInPage";
import SignUpPage from "../pages/SignUpPage";
import { PATHS } from "./paths";

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path={PATHS.signin} element={<SignInPage />} />
        <Route
          path={PATHS.signup}
          element={
            <MainLayout>
              <SignUpPage />
            </MainLayout>
          }
        />
        <Route
          path={PATHS.dashboard}
          element={
            <MainLayout>
              <DashboardPage />
            </MainLayout>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
