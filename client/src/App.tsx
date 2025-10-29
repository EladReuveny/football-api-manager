import {
  Route,
  BrowserRouter as Router,
  Routes,
  useLocation,
} from "react-router-dom";

import { ToastContainer } from "react-toastify";
import Footer from "./components/Footer";
import Header from "./components/Header";
import "./index.css";
import ClubDetails from "./pages/ClubDetails";
import ClubsManagement from "./pages/ClubsManagement";
import ClubsPage from "./pages/ClubsPage";
import CompetitionDetails from "./pages/CompetitionDetails";
import CompetitionsManagement from "./pages/CompetitionsManagement";
import CompetitionsPage from "./pages/CompetitionsPage";
import CountriesManagement from "./pages/CountriesManagement";
import CountriesPage from "./pages/CountriesPage";
import CountryDetails from "./pages/CountryDetails";
import DocumentationPage from "./pages/DocumentationPage";
import ForgotPassword from "./pages/ForgotPassword";
import LandingPage from "./pages/LandingPage";
import Login from "./pages/Login";
import PlayerDetails from "./pages/PlayerDetails";
import PlayersManagement from "./pages/PlayersManagement";
import PlayersPage from "./pages/PlayersPage";
import Profile from "./pages/Profile";
import Register from "./pages/Register";
import UsersManagement from "./pages/UsersManagement";

const Layout = () => {
  const location = useLocation();
  const hideHeader = location.pathname.startsWith("/auth");

  return (
    <>
      {!hideHeader && <Header />}
      <main className="min-h-screen py-20">
        <Routes>
          {/* Public/User routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/auth/login" element={<Login />} />
          <Route path="/auth/register" element={<Register />} />
          <Route path="/auth/forgot-password" element={<ForgotPassword />} />
          <Route path="/docs" element={<DocumentationPage />} />
          <Route path="/clubs" element={<ClubsPage />} />
          <Route path="/clubs/:clubId" element={<ClubDetails />} />
          <Route path="/competitions" element={<CompetitionsPage />} />
          <Route
            path="/competitions/:competitionId"
            element={<CompetitionDetails />}
          />
          <Route path="/countries" element={<CountriesPage />} />
          <Route path="/countries/:countryId" element={<CountryDetails />} />
          <Route path="/players" element={<PlayersPage />} />
          <Route path="/players/:playerId" element={<PlayerDetails />} />

          {/* Private routes (protected routes) */}
          <Route path="/profile" element={<Profile />} />

          {/* Admin routes */}
          <Route
            path="/admin/competitions"
            element={<CompetitionsManagement />}
          />
          <Route path="/admin/players" element={<PlayersManagement />} />
          <Route path="/admin/clubs" element={<ClubsManagement />} />
          <Route path="/admin/countries" element={<CountriesManagement />} />
          <Route path="/admin/users" element={<UsersManagement />} />
        </Routes>
      </main>
      <Footer />
    </>
  );
};
const App = () => {
  return (
    <>
      <Router>
        <ToastContainer
          position="bottom-right"
          autoClose={4000}
          pauseOnHover
          newestOnTop
        />
        <Layout />
      </Router>
    </>
  );
};

export default App;
