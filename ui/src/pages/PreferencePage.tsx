import config from "../config";
import { useState, useEffect } from 'react';
import { Typography, Select, Grid, Layout, Divider, Spin, Row, Col } from 'antd';
import Topbar from '../components/Topbar';
import { Preferences } from '../entities/Preferences';
import { getAccessToken } from "../utils/helpers";
import { useNavigate } from "react-router-dom";
import Footer from "../components/Footer";
const { Title } = Typography;
const { Content } = Layout;
const { useBreakpoint } = Grid;

function Preference() {

    const [preferences, setPreferences] = useState(new Preferences());
    const [isLoading, setIsLoading] = useState(true);
    const [bearerToken, setBearerToken] = useState("");

    useEffect(() => {
        const token = getAccessToken();
        if (token) {
            setBearerToken(token);
            getPreferences(token);
        }
    }, []);

    async function getPreferences(tokenToUse: any) {
        try {
            const response = await fetch(`${config.uri}/preferences`, {
                headers: {
                    'Content-Type': 'application/json',
                    'accept': 'application/json',
                    'Authorization': `Bearer ${tokenToUse}`
                },
            });
            if (!response.ok) {
                throw new Error(`Erro ${response.status}`);
            }
            const preferences = await response.json();
            setPreferences(preferences);
            setIsLoading(false);
        } catch (error) {
            console.error(error);
        }
    }

    async function updatePreferences(dataToUpdate: any) {
        try {
            const response = await fetch(`${config.uri}/preferences`, {
                headers: {
                    'Content-Type': 'application/json',
                    'accept': 'application/json',
                    'Authorization': `Bearer ${bearerToken}`
                },
                method: "PUT",
                body: JSON.stringify(dataToUpdate)
            });
            if (!response.ok) {
                throw new Error(`Erro ${response.status}`);
            }
        } catch (error) {
            console.error(error);
        }
    }

    const handleChangeInPreferences = (value: string, fieldName: string) => {
        const updated = {
            ...preferences,
            [fieldName]: value
        };

        setPreferences(updated);
        updatePreferences(updated);
    };

    const { Text } = Typography;
    const screens = useBreakpoint();
    const isMobile = !screens.sm && screens.xs;
    const rowStyle: React.CSSProperties = {
        textAlign: isMobile ? 'center' : 'left',
        marginBottom: '16px'
    };

    const colStyle: React.CSSProperties = {
        display: 'flex',
        justifyContent: isMobile ? 'center' : 'start',
        alignItems: 'center'
    };

    const selectColStyle: React.CSSProperties = {
        display: 'flex',
        justifyContent: isMobile ? 'center' : 'end'
    };

    const selectStyle: React.CSSProperties = {
        width: 200,
        backgroundColor: '#EDEDED',
        textAlign: 'center'
    };

    return (
        <Layout>
            <Topbar />
            <Content style={{ padding: '24px 24px', backgroundColor: 'white' }}>
                <Spin spinning={isLoading} size="large" />
                {!isLoading && (<div>
                    <Title level={4} style={{ textAlign: 'left', fontWeight: 'bold', letterSpacing: -0.5 }}>Preferências</Title>
                    <Divider />
                    <Row gutter={[16, 16]} align="middle" style={rowStyle}>
                        <Col xs={24} sm={12} style={colStyle}>
                            <Text style={{ fontWeight: 500 }}>Personalidade</Text>
                        </Col>
                        <Col xs={24} sm={12} style={selectColStyle}>
                            <Select
                                value={preferences?.ai_personality}
                                onChange={(value) => handleChangeInPreferences(value, 'ai_personality')}
                                style={selectStyle}
                                options={[
                                    { value: 'Helpful and polite', label: 'Prestativa e educada' },
                                    { value: 'Short and blunt', label: 'Direta e curta' },
                                    { value: 'Sarcastic and humorous', label: 'Sarcástica e bem-humorada' },
                                    { value: 'Formal and professional', label: 'Formal e profissional' },
                                ]}
                            />
                        </Col>
                    </Row>
                    <Divider />
                    <Row gutter={[16, 16]} align="middle" style={rowStyle}>
                        <Col xs={24} sm={12} style={colStyle}>
                            <Text style={{ fontWeight: 500 }}>Modo de foco</Text>
                        </Col>
                        <Col xs={24} sm={12} style={selectColStyle}>
                            <Select
                                value={preferences?.focus_mode_active}
                                onChange={(value) => handleChangeInPreferences(value, 'focus_mode_active')}
                                style={selectStyle}
                                options={[
                                    { value: true, label: 'Ativo' },
                                    { value: false, label: 'Desativado' }
                                ]}
                            />
                        </Col>
                    </Row>
                    <Divider />
                    <Row gutter={[16, 16]} align="middle" style={rowStyle}>
                        <Col xs={24} sm={12} style={colStyle}>
                            <Text style={{ fontWeight: 500 }}>Ocultar dados sensíveis?
                            </Text>
                        </Col>
                        <Col xs={24} sm={12} style={selectColStyle}>
                            <Select
                                value={preferences?.hide_sensitive_data}
                                onChange={(value) => handleChangeInPreferences(value, 'hide_sensitive_data')}
                                style={selectStyle}
                                options={[
                                    { value: true, label: 'Sim' },
                                    { value: false, label: 'Não' }
                                ]}
                            />
                        </Col>
                    </Row>
                </div>)}
            </Content>
            <Footer/>
        </Layout >
    );
}

export default Preference;

