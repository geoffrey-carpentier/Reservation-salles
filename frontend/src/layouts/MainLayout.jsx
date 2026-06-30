// layouts/MainLayout.jsx
import { Outlet } from "react-router-dom";
import Header from "../components/Header.jsx";
import Footer from "../components/Footer.jsx";
function MainLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900 transition-colors">
      <Header />
      <main className="flex-1">
        <Outlet /> {/* ← La page enfant s'affiche ici */}
      </main>
      <Footer />
    </div>
  );
}
export default MainLayout;
