import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Navbar from "./components/Navbar";
import AuthForm from "./components/auth/AuthForm";
import TermsOfService from "./pages/terms/ToS";
import PrivacyPolicy from "./pages/terms/PrivacyPolicy";
import CookieConsent from "./components/ui/CookieConsent";
import ProfilePage from "./pages/profile/ProfileUpdate";
import Profile from "./pages/profile/Profile";
import PrepodsList from "./pages/prepods/PrepodsList";
import ProfileId from "./pages/profile/ProfileId";
import TeacherCard from "./pages/card/TeacherCard";
import NotFoundPage from "./components/ui/404";
import Constructor from "./components/Constructor/Constructor";
import Sites from "./pages/sites/Sites";
import Shared from "./pages/sites/Shared";
import About from "./pages/about/About";
import Rating from "./pages/rating/Rating";
import Subscription from "./pages/premium/Premium";

// Компонент для оборачивания маршрутов с Navbar
const WithNavbar = ({ children }) => {
  return (
    <>
      <Navbar />
      <main className="pt-16 bg-gray-100 flex justify-center items-center min-h-screen">
        {children}
      </main>
    </>
  );
};

export default function App() {
  return (
    <Router>
      <div className="relative min-h-screen">
        <Routes>
          {/* Страница 404 */}
          <Route path="/404" element={<NotFoundPage />} />

          <Route
            path="/"
            element={
              <WithNavbar>
                <About />
              </WithNavbar>
            }
          />
          <Route
            path="/teachers"
            element={
              <WithNavbar>
                <PrepodsList />
              </WithNavbar>
            }
          />
          <Route
            path="/rating"
            element={
              <WithNavbar>
                <Rating />
              </WithNavbar>
            }
          />
          <Route
            path="/subscription"
            element={
              <WithNavbar>
                <Subscription />
              </WithNavbar>
            }
          />

          <Route path="/:username/:unique_id" element={<Shared />} />

          {/* Маршрут конструктора сайта визитки (доступ только для зарегистрированных) */}
          <Route
            path="/constructor"
            element={
              localStorage.getItem("access_token") ? (
                <WithNavbar>
                  <Constructor />
                </WithNavbar>
              ) : (
                <Navigate to="/auth" />
              )
            }
          />
          {/* Редактирование конструктора по уникальному идентификатору (тоже только для зарегистрированных) */}
          <Route
            path="/constructor/:unique_id"
            element={
              localStorage.getItem("access_token") ? (
                <WithNavbar>
                  <Constructor />
                </WithNavbar>
              ) : (
                <Navigate to="/auth" />
              )
            }
          />

          {/* Маршрут для сайтов (только для зарегистрированных) */}
          <Route
            path="/sites"
            element={
              localStorage.getItem("access_token") ? (
                <WithNavbar>
                  <Sites />
                </WithNavbar>
              ) : (
                <Navigate to="/auth" />
              )
            }
          />

          {/* Страница входа */}
          <Route path="/auth" element={<AuthForm />} />

          {/* Страницы с условиями использования */}
          <Route
            path="/terms"
            element={
              <WithNavbar>
                <TermsOfService />
              </WithNavbar>
            }
          />
          <Route
            path="/privacy-policy"
            element={
              <WithNavbar>
                <PrivacyPolicy />
              </WithNavbar>
            }
          />

          {/* Страница редактирования профиля */}
          <Route
            path="/profile/update"
            element={
              <WithNavbar>
                <ProfilePage />
              </WithNavbar>
            }
          />

          {/* Страница профиля по ID */}
          <Route
            path="/profile/:id"
            element={
              <WithNavbar>
                <ProfileId />
              </WithNavbar>
            }
          />

          {/* Страница профиля (только для зарегистрированных) */}
          <Route
            path="/profile"
            element={
              localStorage.getItem("access_token") ? (
                <WithNavbar>
                  <Profile />
                </WithNavbar>
              ) : (
                <Navigate to="/auth" />
              )
            }
          />

          {/* Новый маршрут для карточки преподавателя с username */}
          <Route
            path="/:username/testcard"
            element={
              <WithNavbar>
                <TeacherCard />
              </WithNavbar>
            }
          />

          {/* Перенаправление на страницу 404 для всех несуществующих маршрутов */}
          <Route path="*" element={<Navigate to="/404" replace />} />
        </Routes>
        <CookieConsent />
      </div>
    </Router>
  );
}
