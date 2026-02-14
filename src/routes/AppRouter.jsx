import { BrowserRouter, Route, Routes } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import CreateEventPage from "../pages/CreateEventPage";
import DashboardPage from "../pages/DashboardPage";
import EventFeedPage from "../pages/EventFeed";
import SignInPage from "../pages/SignInPage";
import SignUpPage from "../pages/SignUpPage";
import { PATHS } from "./paths";

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path={PATHS.signin} element={<SignInPage />} />
        <Route element={<MainLayout />}>
          <Route path={PATHS.signup} element={<SignUpPage />} />
          <Route path={PATHS.dashboard} element={<DashboardPage />} />
          <Route path={PATHS.createEvent} element={<CreateEventPage />} />
          <Route path={PATHS.eventFeed} element={<EventFeedPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
