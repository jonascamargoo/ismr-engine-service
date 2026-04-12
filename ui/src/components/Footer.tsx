import { Layout, Flex, Button, App, Divider } from 'antd';
import { LogoutOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const { Footer: AntFooter } = Layout;

const footerStyle: React.CSSProperties = {
    position: 'fixed', 
    bottom: 0, 
    left: 0,        
    width: '100%',     
    zIndex: 1000,
    textAlign: 'center',
    color: '#000000',
    height: 64,
    backgroundColor: '#fefeff',
    fontFamily: 'Wix Madefor Display',
    padding: '0 30px',
    fontSize: 20,
    fontWeight: 500,
    letterSpacing: -0.5,
};

function Footer() {
    const navigate = useNavigate();
    const { message } = App.useApp();

    const handleLogout = () => {
        sessionStorage.removeItem('token');
        message.success('Sessão encerrada com sucesso');
        navigate('/login');
    };

    return (
        <AntFooter style={footerStyle}>
            <Flex justify="end" align="center" style={{ height: '100%' }}>
                <Button 
                    type="text" 
                    danger 
                    icon={<LogoutOutlined />} 
                    onClick={handleLogout}
                    style={{ 
                        display: 'flex', 
                        alignItems: 'center' 
                    }}
                >
                    Sair
                </Button>
            </Flex>
        </AntFooter>
    );
}

export default Footer;