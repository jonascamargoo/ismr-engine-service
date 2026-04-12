import { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from "./pages/HomePage";
import Preference from "./pages/PreferencePage";
import Register from "./pages/RegisterPage";
import Login from "./pages/LoginPage";
import User from "./pages/UserPage";
import Install from './components/Install';
import useOnlineStatus from './hooks/useOnlineStatus';
import Offline from './components/Offline';
import { flushManualQueue } from './utils/syncManager';
import { getAccessToken } from './utils/helpers';
import { App as AntdApp, ConfigProvider, message } from 'antd';
import { useNavigate, useLocation } from "react-router-dom";

function MainContent({ isOnline }) {
  const { message } = AntdApp.useApp();
  const location = useLocation();
  const navigate = useNavigate();
  const path = location.pathname;
  const allowedUnauthenticatedPaths = ["/login", "/register"];

  useEffect(() => {
    const token = getAccessToken();
    if (!token && !allowedUnauthenticatedPaths.includes(path)) {
      navigate("/login");
    }
  }, [path, navigate]); 

  // useEffect(() => {
  //   const handleOnline = () => {
  //     message.success("Você está online novamente!");
  //     setTimeout(() => flushManualQueue(), 1500);
  //   };

  //   window.addEventListener('online', handleOnline);
  //   if (navigator.onLine) {
  //     flushManualQueue();
  //   }

  //   return () => window.removeEventListener('online', handleOnline);
  // }, []);

  return (
    <>
      {!isOnline && <Offline />}
      <div className="main">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/preferences" element={<Preference />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/user" element={<User />} />
        </Routes>
        <Install />
      </div>
    </>
  );
}

function App() {
  const isOnline = useOnlineStatus();

  return (
    <ConfigProvider
      theme={{
        token: {
          fontFamily: "'Wix Madefor Display', sans-serif",
        },
      }}>
      <AntdApp>
        <BrowserRouter>
          <MainContent isOnline={isOnline} />
        </BrowserRouter>
      </AntdApp>
    </ConfigProvider>
  );
}

export default App;