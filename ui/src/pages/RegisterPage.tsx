import { useState } from 'react';
import { Typography, Row, Col, Button, Form, Layout, Divider, Input, App, Space, Spin } from 'antd';
import Topbar from '../components/Topbar';
import { User } from "../entities/User";
import config from '../config';
import { SignatureOutlined } from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
const { Title, Text } = Typography;
const { Content } = Layout;

const labelStyle = {
    color: 'black',
    fontWeight: 500
};

const fieldStyle = {
    backgroundColor: '#EDEDED',
    height: '45px'
};

function Register() {

    const [user, setUser] = useState(new User());
    const [isLoading, setIsLoading] = useState(false);
    const { message } = App.useApp();
    const navigate = useNavigate();

    const onFinish = async () => {

        const dataToRegister = {
            'display_name': user.display_name,
            'username': user.username,
            'password': user.password
        };

        try {
            setIsLoading(true);
            const response = await fetch(`${config.uri}/auth/register`, {
                headers: {
                    'Content-Type': 'application/json',
                    'accept': 'application/json'
                },
                method: "POST",
                body: JSON.stringify(dataToRegister)
            });

            const data = await response.json();
            setIsLoading(false);
            if (!response.ok) {
                const errorMessage = typeof data.detail === 'string'
                    ? data.detail
                    : (data.detail?.[0]?.msg || 'Ocorreu um erro inesperado');

                message.error(errorMessage);
            } else {
                navigate("/login");
            }
        } catch (error) {
            console.error(error);
        }
    };

    const handleChangeInUser = (value: string, fieldName: string) => {
        const updated = {
            ...user,
            [fieldName]: value
        };

        setUser(updated)
    };

    return (
        <Layout>
            <Topbar />
            <Content style={{ padding: '24px 24px', backgroundColor: 'white' }}>
                <Title level={1} style={{ textAlign: 'left', fontWeight: 'bold', letterSpacing: -1 }}>Bem vindo{user.display_name != 'null' && (`, ${user.display_name}`)}</Title>
                <Divider />
                <Form
                    layout="vertical"
                    onFinish={onFinish}
                    requiredMark="optional"
                >
                    <Space orientation="vertical" size="large" style={{ width: '100%' }}>

                        <Row gutter={[16, 16]} style={{ width: '100%' }} justify="end">
                            <Col xs={24} sm={8}>
                                <Form.Item
                                    name="display_name"
                                    label={<Text style={labelStyle}>Nome</Text>}
                                    rules={[{ required: true, message: 'Por favor, insira seu nome' }]}
                                >
                                    <Input
                                        onChange={(e) => handleChangeInUser(e.target.value, 'display_name')}
                                        style={fieldStyle}
                                    />
                                </Form.Item>
                            </Col>

                            <Col xs={24} sm={8}>
                                <Form.Item
                                    name="username"
                                    label={<Text style={labelStyle}>Username</Text>}
                                    rules={[{ required: true, message: 'Insira um username' }]}
                                >
                                    <Input
                                        onChange={(e) => handleChangeInUser(e.target.value, 'username')}
                                        style={fieldStyle}
                                    />
                                </Form.Item>
                            </Col>

                            <Col xs={24} sm={8}>
                                <Form.Item
                                    name="password"
                                    label={<Text style={labelStyle}>Senha</Text>}
                                    rules={[{ required: true, message: 'A senha é obrigatória' }]}
                                >
                                    <Input.Password
                                        onChange={(e) => handleChangeInUser(e.target.value, 'password')}
                                        style={fieldStyle}
                                    />
                                </Form.Item>
                            </Col>
                            <Col xs={24} sm={8} md={4}>
                                <Button
                                    type="primary"
                                    htmlType="submit"
                                    block
                                    style={{
                                        backgroundColor: 'black',
                                        borderColor: 'black',
                                        height: '45px',
                                        fontWeight: 'bold',
                                        borderRadius: '8px',
                                        color: 'white'
                                    }}
                                >
                                    Cadastrar <SignatureOutlined />
                                </Button>
                            </Col>
                        </Row>
                        <Row gutter={[16, 16]}>
                            <Col xs={24} sm={24} md={24}>
                                <Link style={{ textAlign: 'center' }} to={'/login'}>Já tenho uma conta</Link>
                            </Col>
                        </Row>
                    </Space>
                </Form>
                <Spin style={{ marginTop: 20 }} spinning={isLoading} />
            </Content>
        </Layout>
    );
}

export default Register;

