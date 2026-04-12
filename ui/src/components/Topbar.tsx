import {
    UserOutlined, SettingOutlined,
    LeftOutlined
} from '@ant-design/icons';
import { Typography, Flex, Layout } from 'antd';
import { Link } from 'react-router-dom';
const { Title } = Typography;
const { Header } = Layout;
import { useLocation, useNavigate } from 'react-router-dom';

const headerStyle: React.CSSProperties = {
    textAlign: 'center',
    color: '#000000',
    height: 64,
    backgroundColor: '#fefeff',
    fontFamily: 'Wix Madefor Display',
    padding: 0,
    paddingLeft: 30,
    paddingRight: 30,
    fontSize: 20,
    fontWeight: 500,
    letterSpacing: -0.5
};

function Topbar() {
    const location = useLocation();
    const navigate = useNavigate();
    const path = location.pathname;

    const showSettings = path === "/";
    const showBack = ["/preferences", "/user"].includes(path);
    const showUser = ["/", "/preferences"].includes(path);
    const showOnlyTitle = ["/login", "/register"].includes(path);

    return (
        <Header style={headerStyle}>
            <div style={{ position: 'relative', height: '100%', display: 'flex', alignItems: 'center' }}>
                
                <div style={{ flex: 1, display: 'flex', justifyContent: 'flex-start' }}>
                    {!showOnlyTitle && (
                        <>
                            {showSettings && (
                                <Link to="/preferences" style={{ color: 'black' }}>
                                    <SettingOutlined />
                                </Link>
                            )}
                            {showBack && (
                                <div onClick={() => navigate(-1)} style={{ cursor: 'pointer', display: 'flex' }}>
                                    <LeftOutlined />
                                </div>
                            )}
                        </>
                    )}
                </div>

                <div style={{
                    position: 'absolute',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    textAlign: 'center',
                    pointerEvents: 'none' 
                }}>
                    <Title level={4} style={{ 
                        fontWeight: 100, 
                        fontFamily: 'Google Sans', 
                        margin: 0,
                        pointerEvents: 'auto' 
                    }}>
                        ismr
                    </Title>
                </div>

                <div style={{ flex: 1, display: 'flex', justifyContent: 'flex-end' }}>
                    {showUser && (
                        <Link to="/user" style={{ color: '#7879F1' }}>
                            <UserOutlined />
                        </Link>
                    )}
                </div>
            </div>
        </Header>
    );
}

export default Topbar;