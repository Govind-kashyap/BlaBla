import { useNavigate } from "react-router-dom";
import { Layout, Menu, Button, Card, Avatar } from "antd";
import { useRef, useState, useEffect } from "react";
import axios from "axios";
import logo from "../assets/logo.png";
import { logout } from "../API/authaApi";

const API_URL = import.meta.env.VITE_API_URL;
const { Header, Content } = Layout;

function Myprofile() {
    const navigate = useNavigate();

    const [user, setUser] = useState(null);
    const [profileImage, setProfileImage] = useState(null);
    const fileInputRef = useRef(null);

    // Get user 
    useEffect(() => {
        const getProfile = async () => {
        try {
            const res = await axios.get(
            `${API_URL}/api/user/me`,
            { withCredentials: true }
            );

            if (res.data?.user) {
            setUser(res.data.user);

            if (res.data.user.profileImage) {
                setProfileImage(API_URL + res.data.user.profileImage);
            }
            }
        } catch (err) {
            console.log("Profile fetch error:", err);
        }
        };

        getProfile();
    }, []);

    // Upload profile image
    const handleImageUpload = async (e) => {
        try {
        const file = e.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append("profile", file);

        const res = await axios.post(
            `${API_URL}/api/user/upload-profile`,
            formData,
            {
            withCredentials: true,
            headers: {
                "Content-Type": "multipart/form-data",
            },
            }
        );

        if (res.data.success) {
            setProfileImage(API_URL + res.data.profileImage);
        }
        } catch (err) {
        console.log("Image upload error:", err);
        }
    };

    //  LOGOUT
    const handleLogout = async () => {
        try {
        await logout();
        navigate("/login");
        } catch (err) {
        console.log(err);
        }
    };

    const items = [
        {
        key: "logout",
        label: "Logout",
        onClick: handleLogout,
        },
    ];

    return (
        <Layout className="min-h-screen">
        {/* HEADER */}
        <Header className="flex justify-between items-center sticky top-0 z-10">
            <img src={logo} alt="Logo" className="h-10 w-32" />

            <div className="flex items-center gap-4">
            <Menu theme="dark" mode="horizontal" items={items} />
            <Button onClick={() => navigate("/home")}>
                Back To Home
            </Button>
            </div>
        </Header>

        {/* CONTENT */}
        <Content className="flex justify-center items-center bg-gray-100 h-[91vh]">
            <Card className="w-full h-[50vh] max-w-md shadow-lg rounded-xl p-6 flex flex-col items-center">
            <div className="flex flex-col items-center text-center gap-3">

                {/* PROFILE IMAGE */}
                <div className="relative">
                <Avatar
                    size={96}
                    src={profileImage}
                    className="cursor-pointer bg-gray-300"
                    onClick={() => fileInputRef.current.click()}
                >
                    {!profileImage && user?.username?.charAt(0)}
                </Avatar>

                <div
                    onClick={() => fileInputRef.current.click()}
                    className="absolute inset-0 rounded-full bg-black/40 
                    opacity-0 hover:opacity-100 flex items-center 
                    justify-center text-white text-sm cursor-pointer"
                >
                    Change
                </div>
                </div>

                {/* FILE INPUT */}
                <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                className="hidden"
                onChange={handleImageUpload}
                />

                {/* USER INFO */}
                <div className="mt-2">
                <h2 className="text-xl font-semibold">
                    {user?.username}
                </h2>

                <p className="text-gray-500">
                    {user?.email}
                </p>

                <span className="text-sm bg-blue-100 text-blue-600 px-3 py-1 rounded-full">
                    {user?.phoneNumber}
                </span>
                </div>

                {/* ACTION BUTTONS */}
                <div className="flex gap-3 mt-4">
                <Button type="primary">Edit Profile</Button>
                <Button danger onClick={handleLogout}>
                    Logout
                </Button>
                </div>

            </div>
            </Card>
        </Content>
        </Layout>
    );
}

export default Myprofile;
