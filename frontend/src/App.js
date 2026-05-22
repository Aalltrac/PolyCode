import "@/App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { Layout } from "@/components/Layout";
import { KofiWidget } from "@/components/KofiWidget";
import { Toaster } from "sonner";

import Login from "@/pages/Login";
import Roadmap from "@/pages/Roadmap";
import CourseDetail from "@/pages/CourseDetail";
import ChapterViewer from "@/pages/ChapterViewer";
import Messages from "@/pages/Messages";
import Admin from "@/pages/Admin";
import Donations from "@/pages/Donations";

function ProtectedLayout({ children }) {
  return (
    <ProtectedRoute>
      <Layout>{children}</Layout>
    </ProtectedRoute>
  );
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            path="/"
            element={
              <ProtectedLayout>
                <Roadmap />
              </ProtectedLayout>
            }
          />
          <Route
            path="/courses/:languageId"
            element={
              <ProtectedLayout>
                <CourseDetail />
              </ProtectedLayout>
            }
          />
          <Route
            path="/courses/:languageId/chapters/:chapterId"
            element={
              <ProtectedLayout>
                <ChapterViewer />
              </ProtectedLayout>
            }
          />
          <Route
            path="/messages"
            element={
              <ProtectedLayout>
                <Messages />
              </ProtectedLayout>
            }
          />
          <Route
            path="/donations"
            element={
              <ProtectedLayout>
                <Donations />
              </ProtectedLayout>
            }
          />
          <Route
            path="/admin"
            element={
              <ProtectedRoute adminOnly>
                <Layout>
                  <Admin />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="*"
            element={
              <ProtectedLayout>
                <Roadmap />
              </ProtectedLayout>
            }
          />
        </Routes>
        <KofiWidget />
        <Toaster
          theme="dark"
          position="top-right"
          toastOptions={{
            style: {
              background: "#0A0A0F",
              border: "1px solid rgba(106,102,235,0.3)",
              color: "#EDEDED",
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: "12px",
            },
          }}
        />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
