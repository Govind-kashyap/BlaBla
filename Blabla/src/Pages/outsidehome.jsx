import React from 'react';
import {
    AppstoreOutlined,
    BarChartOutlined,
    CloudOutlined,
    ShopOutlined,
    TeamOutlined,
    UploadOutlined,
    UserOutlined,
    VideoCameraOutlined,
} from '@ant-design/icons';

import { useNavigate } from 'react-router-dom';

import { Layout, Menu, theme, Button } from 'antd';
const { Header, Content, Footer, Sider } = Layout;
const siderStyle = {
    overflow: 'auto',
    height: '100vh',
    position: 'sticky',
    insetInlineStart: 0,
    top: 0,
    scrollbarWidth: 'thin',
    scrollbarGutter: 'stable',
};

const items = [
    UserOutlined,
    VideoCameraOutlined,
    UploadOutlined,
    BarChartOutlined,
    CloudOutlined,
    AppstoreOutlined,
    TeamOutlined,
    ShopOutlined,
].map((icon, index) => ({
    key: String(index + 1),
    icon: React.createElement(icon),
    label: `nav ${index + 1}`,
}));

const Outsidehome = () => {
    const navigate = useNavigate();
    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();

    return (
        <Layout hasSider>
        <Sider style={siderStyle}>
            <div className="demo-logo-vertical" />
            <h1 className='text-3xl text-white font-bold p-4'>BlaBla</h1>
            <Menu theme="dark" mode="inline" defaultSelectedKeys={['1']} items={items} />
            <div className="flex flex-col justify-between w-50 p-5 gap-5 mt-45">
                    <Button
                    onClick={() => navigate("/login")}
                    >
                    Login
                    </Button>

                    <Button
                    onClick={() => navigate("/register")}>
                    Register
                    </Button>
                </div>
        </Sider>
        <Layout>
            <Content style={{ margin: '10px 16px 0', overflow: 'initial' }}>
            <div
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                textAlign: 'center',
                padding: '24px',
                background: colorBgContainer,
                borderRadius: borderRadiusLG,
                height: '100vh',
                backgroundImage: 'url(./background_image_blabla1.jpg)',
                backgroundSize:'cover',
                backgroundRepeat: 'no-repeat',
                }}
            >
            <h1 className='text-white text-4xl font-bold'>Travel Smart with BlaBla</h1>
            <p className='text-white text-2xl w-100 '>Login karo aur apni perfect ride ya travel partner dhoondo. Safe, easy aur budget-friendly safar yahin se start hota hai.</p>

            </div>
            </Content>
            <Footer style={{ textAlign: 'center' }}>
            Ant Design ©{new Date().getFullYear()} Created by Ant UED
            </Footer>
        </Layout>
        </Layout>
    );
};

export default Outsidehome;