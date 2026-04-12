import { useEffect, useState } from 'react';
import { Typography, Row, Col, Button, Form, Layout, Divider, Input, App, Space, Spin } from 'antd';
import Topbar from '../components/Topbar';
import { User } from "../entities/User";
import config from '../config';
import { SignatureOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { getAccessToken } from '../utils/helpers';
import Footer from '../components/Footer';
const { Text } = Typography;
const { Content } = Layout;

const labelStyle = {
    color: 'black',
    fontWeight: 500
};

const fieldStyle = {
    backgroundColor: '#EDEDED',
    height: '45px'
};

function UserPage() {

    const [user, setUser] = useState(new User());
    const { message } = App.useApp();
    const [bearerToken, setBearerToken] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [form] = Form.useForm();

    useEffect(() => {
        const token = getAccessToken();
        if (token) {
            setBearerToken(token);
            getUser(token);
        }
    }, []);

    useEffect(() => {
        if (!isLoading && user) {
            form.setFieldsValue({
                display_name: user.display_name,
                username: user.username,
            });
        }
    }, [user, isLoading, form]);

    async function getUser(tokenToUse: any) {
        try {
            const response = await fetch(`${config.uri}/users/me`, {
                headers: {
                    'Content-Type': 'application/json',
                    'accept': 'application/json',
                    'Authorization': `Bearer ${tokenToUse}`
                },
            });
            if (!response.ok) {
                throw new Error(`Erro ${response.status}`);
            }
            const user = await response.json();
            setUser(user);
            setIsLoading(false);
        } catch (error) {
            console.error(error);
        }
    }

    const onFinish = async () => {

        const dataToRegister = {
            'display_name': user.display_name,
            'username': user.username,
            'password': user.password
        };

        try {
            setIsLoading(true);
            const response = await fetch(`${config.uri}/users/me`, {
                headers: {
                    'Content-Type': 'application/json',
                    'accept': 'application/json',
                    'Authorization': `Bearer ${bearerToken}`
                },
                method: "PUT",
                body: JSON.stringify(dataToRegister)
            });

            const data = await response.json();
            setIsLoading(false);
            if (!response.ok) {
                const errorMessage = typeof data.detail === 'string'
                    ? data.detail
                    : (data.detail?.[0]?.msg || 'Ocorreu um erro inesperado');

                message.error(errorMessage);
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

        setUser(updated);
    };

    return (
        <Layout>
            <Topbar />
            <Content style={{ padding: '24px 24px', backgroundColor: 'white' }}>
                <Spin spinning={isLoading} size="large" />
                {!isLoading && (<div>
                    <Divider />
                    <Form
                        form={form}
                        layout="vertical"
                        onFinish={onFinish}
                        requiredMark="optional"
                        initialValues={{
                            display_name: user.display_name,
                            username: user.username
                        }}
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
                                            value={user.display_name}
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
                                            value={user.username}
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
                                        Alterar <SignatureOutlined />
                                    </Button>
                                </Col>
                            </Row>
                        </Space>
                    </Form>
                </div>)}
            </Content>
            <Footer/>
        </Layout>
    );
}

export default UserPage;

