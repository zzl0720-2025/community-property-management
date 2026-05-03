import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Navigate,
  Route,
  Routes,
  useLocation,
  useNavigate,
} from "react-router-dom";
import { Button, Layout, Space, Typography } from "antd";
import { LogoutOutlined, MenuOutlined } from "@ant-design/icons";
import LoginPage from "./components/LoginPage";
import Sidebar from "./components/Sidebar";
import Admin from "./pages/Admin";
import Dashboard from "./pages/Dashboard";
import Discussion from "./pages/Discussion";
import Payment from "./pages/Payment";
import RoomReserving from "./pages/RoomReserving";

const { Header, Content } = Layout;
const LOGIN_ROUTE = "/login/user";

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

function AppContent() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [authed, setAuthed] = useState(() => Boolean(localStorage.getItem("token")));
  const [accountType, setAccountType] = useState(
    () => localStorage.getItem("accountType") || "user",
  );
  const location = useLocation();
  const navigate = useNavigate();
  const isLoginRoute = location.pathname.startsWith("/login");

  useEffect(() => {
    setDrawerOpen(false);
  }, [location.pathname]);

  const handleLoginSuccess = ({ token, accountType: nextAccountType }) => {
    localStorage.setItem("token", token);
    localStorage.setItem("accountType", nextAccountType);
    setAuthed(true);
    setAccountType(nextAccountType);
    navigate(nextAccountType === "admin" ? "/admin" : "/", { replace: true });
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("accountType");
    setAuthed(false);
    setAccountType("user");
    navigate(LOGIN_ROUTE, { replace: true });
  };

  return (
    <Layout style={styles.layout}>
      <Header style={styles.header}>
        <Space size={16}>
          {authed ? (
            <Button
              type="text"
              icon={<MenuOutlined style={{ fontSize: 18 }} />}
              onClick={() => setDrawerOpen(true)}
              aria-label="Open navigation"
            />
          ) : null}
          <Typography.Title level={4} style={styles.brand}>
            Community Service
          </Typography.Title>
        </Space>
        {authed ? (
          <Button type="text" icon={<LogoutOutlined />} onClick={handleLogout}>
            Log Out
          </Button>
        ) : null}
      </Header>

      {authed ? (
        <Sidebar
          open={drawerOpen}
          onClose={() => setDrawerOpen(false)}
          isAdmin={accountType === "admin"}
        />
      ) : null}

      <Layout style={styles.contentLayout}>
        <Content style={isLoginRoute ? styles.authContent : styles.content}>
          <Routes>
            <Route path="/login" element={<Navigate to={LOGIN_ROUTE} replace />} />
            <Route
              path="/login/user"
              element={
                authed ? (
                  <Navigate to={accountType === "admin" ? "/admin" : "/"} replace />
                ) : (
                  <LoginPage mode="user" onLoginSuccess={handleLoginSuccess} />
                )
              }
            />
            <Route
              path="/login/admin"
              element={
                authed ? (
                  <Navigate to={accountType === "admin" ? "/admin" : "/"} replace />
                ) : (
                  <LoginPage mode="admin" onLoginSuccess={handleLoginSuccess} />
                )
              }
            />
            <Route
              path="/"
              element={
                <ProtectedRoute authed={authed}>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/discussion"
              element={
                <ProtectedRoute authed={authed}>
                  <Discussion />
                </ProtectedRoute>
              }
            />
            <Route
              path="/payment"
              element={
                <ProtectedRoute authed={authed}>
                  <Payment />
                </ProtectedRoute>
              }
            />
            <Route
              path="/rooms"
              element={
                <ProtectedRoute authed={authed}>
                  <RoomReserving />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin"
              element={
                <AdminRoute authed={authed} accountType={accountType}>
                  <Admin />
                </AdminRoute>
              }
            />
            <Route
              path="*"
              element={
                <Navigate
                  to={authed ? (accountType === "admin" ? "/admin" : "/") : LOGIN_ROUTE}
                  replace
                />
              }
            />
          </Routes>
        </Content>
      </Layout>
    </Layout>
  );
}

function ProtectedRoute({ authed, children }) {
  if (!authed) {
    return <Navigate to={LOGIN_ROUTE} replace />;
  }

  return children;
}

function AdminRoute({ authed, accountType, children }) {
  if (!authed) {
    return <Navigate to={LOGIN_ROUTE} replace />;
  }

  if (accountType !== "admin") {
    return <Navigate to="/" replace />;
  }

  return children;
}

const styles = {
  layout: {
    minHeight: "100vh",
  },
  header: {
    background: "#ffffff",
    padding: "0 24px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    boxShadow: "0 2px 8px rgba(15, 23, 42, 0.06)",
  },
  brand: {
    margin: 0,
  },
  contentLayout: {
    background: "#f5f7fb",
  },
  content: {
    padding: "32px 40px",
  },
  authContent: {
    padding: 0,
  },
};

export default App;
