import { Navigate, Route, Routes } from "react-router-dom";
import { Layout } from "./components/Layout";
import { PokedexPage } from "./pages/PokedexPage";
import { FichePage } from "./pages/FichePage";
import { NotFoundPage } from "./pages/NotFoundPage";

// Seules les pages déjà migrées sont ici. Les autres sont servies par PHP (voir vite.config.ts).
export function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Navigate to="/pokedex" replace />} />
        <Route path="/pokedex" element={<PokedexPage />} />
        <Route path="/pokemon/:id" element={<FichePage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Layout>
  );
}
