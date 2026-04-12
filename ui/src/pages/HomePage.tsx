import { motion } from 'framer-motion';
import { Logo } from "../components/Logo";
import { ActiveLogo } from "../components/ActiveLogo";
import { useState } from 'react';
import { Typography, Flex, Layout, Button } from 'antd';
import Topbar from '../components/Topbar';
const { Title } = Typography;
const { Content } = Layout;
import { useVibration } from '../hooks/useVibration';
import Footer from '../components/Footer';

const layoutStyle: React.CSSProperties = {
    minHeight: '100vh',
    backgroundColor: 'white'
};

const contentStyle: React.CSSProperties = {
    padding: '24px',
    backgroundColor: 'white',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1
};


function HomePage() {
    const [isActive, setIsActive] = useState(false);
    const { vibrate } = useVibration();
    
    return (
        <Layout style={layoutStyle}>
            <Topbar />
            <Content style={contentStyle}>
                <Flex vertical align="center" gap="large" justify="center" style={{ width: '100%' }}>
                    <div style={{ height: 30, display: 'flex', alignItems: 'center' }}>
                        {isActive && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                            >
                                <Title level={5} style={{
                                    fontWeight: 600,
                                    letterSpacing: -0.5,
                                    fontFamily: 'Google Sans',
                                    color: 'black',
                                    margin: 0
                                }}>
                                    Ouvindo . . .
                                </Title>
                            </motion.div>
                        )}
                    </div>

                    <Button
                        type="text"
                        onClick={async () => {
                            const permission = await Notification.requestPermission();
                            if (!isActive) {
                                vibrate(1000);
                                if (permission === 'granted') {
                                    const registration = await navigator.serviceWorker.ready;

                                    registration.showNotification("Estamos ouvindo!", {
                                        body: "O aplicativo está ativo e processando áudio.",
                                        icon: "/logo192.png", // Path to your icon in the public folder
                                        tag: "ismr-active", // Unique ID to prevent duplicate popups
                                    });
                                }
                            }
                            setIsActive(!isActive);

                        }}
                        style={{ height: 'auto', padding: 0 }}
                    >
                        {isActive ? (
                            <motion.div
                                animate={{ scale: [1, 1.2, 1] }}
                                transition={{ repeat: Infinity, duration: 1.2 }}
                            >
                                <ActiveLogo />
                            </motion.div>
                        ) : (
                            <Logo />
                        )}
                    </Button>
                </Flex>
            </Content>
            <Footer/>
        </Layout>
    );
}

export default HomePage;

