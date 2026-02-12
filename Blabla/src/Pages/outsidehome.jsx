// import React from 'react';
// import {
//     AppstoreOutlined,
//     BarChartOutlined,
//     CloudOutlined,
//     ShopOutlined,
//     TeamOutlined,
//     UploadOutlined,
//     UserOutlined,
//     VideoCameraOutlined,
// } from '@ant-design/icons';

// import { useNavigate } from 'react-router-dom';

// import { Layout, Menu, theme, Button } from 'antd';
// const { Header, Content, Footer, Sider } = Layout;
// const siderStyle = {
//     overflow: 'auto',
//     height: '100vh',
//     position: 'sticky',
//     insetInlineStart: 0,
//     top: 0,
//     scrollbarWidth: 'thin',
//     scrollbarGutter: 'stable',
// };

// const items = [
//     UserOutlined,
//     VideoCameraOutlined,
//     UploadOutlined,
//     BarChartOutlined,
//     CloudOutlined,
//     AppstoreOutlined,
//     TeamOutlined,
//     ShopOutlined,
// ].map((icon, index) => ({
//     key: String(index + 1),
//     icon: React.createElement(icon),
//     label: `nav ${index + 1}`,
// }));

// const Outsidehome = () => {
//     const navigate = useNavigate();
//     const {
//         token: { colorBgContainer, borderRadiusLG },
//     } = theme.useToken();

//     return (
//         <Layout hasSider>
//         <Sider style={siderStyle}>
//             <div className="demo-logo-vertical" />
//             <h1 className='text-3xl text-white font-bold p-4'>BlaBla</h1>
//             <Menu theme="dark" mode="inline" defaultSelectedKeys={['1']} items={items} />
//             <div className="flex flex-col justify-between w-50 p-5 gap-5 mt-45">
//                     <Button
//                     onClick={() => navigate("/login")}
//                     >
//                     Login
//                     </Button>

//                     <Button
//                     onClick={() => navigate("/register")}>
//                     Register
//                     </Button>
//                 </div>
//         </Sider>
//         <Layout>
//             <Content style={{ margin: '10px 16px 0', overflow: 'initial' }}>
//             <div
//                 style={{
//                     display: 'flex',
//                     flexDirection: 'column',
//                     justifyContent: 'center',
//                     alignItems: 'center',
//                 textAlign: 'center',
//                 padding: '24px',
//                 background: colorBgContainer,
//                 borderRadius: borderRadiusLG,
//                 height: '100vh',
//                 backgroundImage: 'url(./background_image_blabla1.jpg)',
//                 backgroundSize:'cover',
//                 backgroundRepeat: 'no-repeat',
//                 }}
//             >
//             <h1 className='text-white text-4xl font-bold'>Travel Smart with BlaBla</h1>
//             <p className='text-white text-2xl w-100 '>Login karo aur apni perfect ride ya travel partner dhoondo. Safe, easy aur budget-friendly safar yahin se start hota hai.</p>

//             </div>
//             </Content>
//             <Footer style={{ textAlign: 'center' }}>
//             Ant Design ©{new Date().getFullYear()} Created by Ant UED
//             </Footer>
//         </Layout>
//         </Layout>
//     );
// };

// export default Outsidehome;


import React, { useState } from "react";
import {
    HomeOutlined,
    InfoCircleOutlined,
    PhoneOutlined,
    LoginOutlined,
    UserAddOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { Layout, Menu, Button } from "antd";

const { Header, Content, Footer, Sider } = Layout;

const Outsidehome = () => {
    const navigate = useNavigate();
    const [selectedKey, setSelectedKey] = useState("home");

    const menuItems = [
        {
        key: "home",
        icon: <HomeOutlined />,
        label: "Home",
        },
        {
        key: "about",
        icon: <InfoCircleOutlined />,
        label: "About",
        },
        {
        key: "contact",
        icon: <PhoneOutlined />,
        label: "Contact",
        },
    ];

    const renderContent = () => {
    switch (selectedKey) {
        case "about":
        return (
            <>
            <h1 className="text-4xl font-bold text-white mb-6">
                About BlaBla Ride Sharing
            </h1>

            <p className="text-lg text-white max-w-3xl mb-4">
                BlaBla is a modern ride-sharing platform designed to make
                travel smarter, safer and more affordable. Whether you're
                planning a long-distance journey or a short city ride,
                BlaBla connects drivers with empty seats to passengers
                looking for a budget-friendly travel option.
            </p>

            <div className="grid md:grid-cols-3 gap-6 mt-6 text-white">
                <div className="bg-white/20 p-6 rounded-xl">
                <h3 className="font-bold text-xl mb-2"> Easy Ride Creation</h3>
                <p>Create your ride in seconds and share your journey with others.</p>
                </div>

                <div className="bg-white/20 p-6 rounded-xl">
                <h3 className="font-bold text-xl mb-2"> Safe & Secure</h3>
                <p>Verified users, profile photos and booking approvals ensure safety.</p>
                </div>

                <div className="bg-white/20 p-6 rounded-xl">
                <h3 className="font-bold text-xl mb-2"> Budget Friendly</h3>
                <p>Save money by sharing travel costs with trusted co-passengers.</p>
                </div>
            </div>
            </>
        );

        case "contact":
        return (
            <>
            <h1 className="text-4xl font-bold text-white mb-6">
                Contact BlaBla Support
            </h1>

            <p className="text-lg text-white mb-4">
                Have questions, feedback, or need help? We’re here for you.
            </p>

            <div className="bg-white/20 p-8 rounded-2xl text-white max-w-xl">
                <p className="mb-3"> Email: support@blablaride.com</p>
                <p className="mb-3"> Phone: +91 98765 43210</p>
                <p> Office: New Delhi, India</p>
            </div>
            </>
        );

        default:
        return (
            <>
            <h1 className="text-5xl font-bold text-white mb-6">
                Travel Smart with BlaBla
            </h1>

            <p className="text-xl text-white max-w-3xl mb-6">
                Share rides, split costs, and travel comfortably.
                BlaBla helps you find trusted drivers and passengers
                heading in the same direction.
            </p>

            {/* FEATURES SECTION */}
            <div className="grid md:grid-cols-3 gap-6 mt-6 text-white max-w-4xl">
                <div className="bg-white/20 p-6 rounded-xl">
                <h3 className="font-bold text-xl mb-2"> Smart Matching</h3>
                <p>
                    Find rides based on your preferred route, date and time.
                </p>
                </div>

                <div className="bg-white/20 p-6 rounded-xl">
                <h3 className="font-bold text-xl mb-2"> Verified Profiles</h3>
                <p>
                    View driver profiles, ratings and photos before booking.
                </p>
                </div>

                <div className="bg-white/20 p-6 rounded-xl">
                <h3 className="font-bold text-xl mb-2"> Instant Booking</h3>
                <p>
                    Send booking requests and get quick approvals from drivers.
                </p>
                </div>
            </div>

            <div className="flex gap-4 mt-10">
                <Button
                type="primary"
                size="large"
                icon={<LoginOutlined />}
                onClick={() => navigate("/login")}
                >
                Login
                </Button>

                <Button
                size="large"
                icon={<UserAddOutlined />}
                onClick={() => navigate("/register")}
                >
                Register
                </Button>
            </div>
            </>
        );
    }
    };


    return (
        <Layout hasSider>
        {/* SIDEBAR */}
        <Sider
            style={{
            height: "100vh",
            position: "sticky",
            top: 0,
            }}
        >
            <div className="text-white text-3xl font-bold p-6 text-center">
            BlaBla
            </div>

            <Menu
            theme="dark"
            mode="inline"
            selectedKeys={[selectedKey]}
            onClick={(e) => setSelectedKey(e.key)}
            items={menuItems}
            />
        </Sider>

        {/* MAIN LAYOUT */}
        <Layout>
            <Header className="flex justify-end items-center px-8 bg-white shadow">
            <div className="flex gap-4">
                <Button onClick={() => navigate("/login")}>Login</Button>
                <Button
                type="primary"
                onClick={() => navigate("/register")}
                >
                Register
                </Button>
            </div>
            </Header>

            <Content
            style={{
                margin: "0",
                padding: "0",
            }}
            >
            <div
                className="flex flex-col items-center justify-center text-center px-6"
                style={{
                minHeight: "calc(100vh - 64px)",
                backgroundImage:
                    "url('/background_image_blabla2.jpg')",
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
                }}
            >
                <div className="bg-black/50 p-10 rounded-2xl">
                {renderContent()}
                </div>
            </div>
            </Content>

            <Footer className="text-center">
            © {new Date().getFullYear()} BlaBla Ride Sharing. All Rights Reserved.
            </Footer>
        </Layout>
        </Layout>
    );
    };

export default Outsidehome;
