import { useNavigate } from "react-router-dom";
import { Layout, Menu, Button } from "antd";
const { Header, Content } = Layout;
import axios from "axios";
import logo from "../assets/logo.png";

const API_URL = import.meta.env.VITE_API_URL;

function Myprofile() {

    const navigate = useNavigate();

    const items = [
        {
            key: "logout",
            label: "Logout",
            onClick: async () => {
            try {
                await axios.post(
                `${API_URL}/api/user/logout`,
                {},
                { withCredentials: true }
                );
                navigate("/login");
            } catch (err) {
                console.log("Logout error", err);
            }
            },
        },
    ];


    return (
        <Layout>
            <Header
            style={{
            position: 'sticky',
            top: 0,
            zIndex: 1,
            width: '100%',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            }}
        >
            <img src={logo} alt="BlaBla Logo" className="h-30 w-40 inline-block mr-2" />
            <div className="flex ml-10 h-10 items-center">
            <Menu
            theme="dark"
            mode="horizontal"
            defaultSelectedKeys={['1']}
            items={items}
            style={{ flex: 1, minWidth: 0 }}
            />
            
            <Button
            onClick={() => {
                navigate("/home");
            }}
            >Back To Home</Button>
            </div>
        </Header>
            <Content className="h-[91vh] p-20">
            <h1>My Profile</h1>
            </Content>
        </Layout>
    )
}

export default Myprofile;