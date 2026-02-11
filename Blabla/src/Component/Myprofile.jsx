import { useNavigate } from "react-router-dom";
import { Layout, Menu, Button, Card, Avatar, Modal, Input, message } from "antd";
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
    const [editOpen, setEditOpen] = useState(false);

    const [editUsername, setEditUsername] = useState("");
    const [editPhone, setEditPhone] = useState("");

    const fileInputRef = useRef(null);

    useEffect(() => {
        const getProfile = async () => {
        try {
            const res = await axios.get(
            `${API_URL}/api/user/me`,
            { withCredentials: true }
            );

            if (res.data?.user) {
            setUser(res.data.user);
            setEditUsername(res.data.user.username);
            setEditPhone(res.data.user.phoneNumber);

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

    const handleImageUpload = async (e) => {
        try {
        const file = e.target.files[0];
        if (!file) return;

        const maxSize = 2 * 1024 * 1024;
        if (file.size > maxSize) {
            message.error("Image size too large (Max 2MB allowed)");
            return;
        }

        const formData = new FormData();
        formData.append("profile", file);

        const res = await axios.post(
            `${API_URL}/api/user/upload-profile`,
            formData,
            {
            withCredentials: true,
            headers: { "Content-Type": "multipart/form-data" },
            }
        );

        if (res.data.success) {
            setProfileImage(API_URL + res.data.profileImage);
            message.success("Profile image updated");
        }
        } catch (err) {
        console.log("Image upload error:", err);
        message.error("Image upload failed");
        }
    };

    const handleUpdateProfile = async () => {
        try {
        const res = await axios.put(
            `${API_URL}/api/user/update-profile`,
            {
            username: editUsername,
            phoneNumber: editPhone,
            },
            { withCredentials: true }
        );

        if (res.data.success) {
            setUser(res.data.user);
            setEditOpen(false);
            message.success("Profile updated successfully");
        }
        } catch (err) {
        console.log(err);
        message.error("Profile update failed");
        }
    };

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
            <img src={logo} alt="Logo" className="h-30 w-32" />

            <div className="flex items-center gap-4">
            <Menu theme="dark" mode="horizontal" items={items} />
            <Button onClick={() => navigate("/home")}>Back To Home</Button>
            </div>
        </Header>

        {/* CONTENT */}
        <Content className="flex justify-center items-center bg-gray-100 h-[91vh]">
            <Card className="w-full h-[50vh] max-w-md shadow-lg rounded-xl p-6">
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

                <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                className="hidden"
                onChange={handleImageUpload}
                />

                {/* USER INFO */}
                <h2 className="text-xl font-semibold">{user?.username}</h2>
                <p className="text-gray-500">{user?.email}</p>
                <span className="text-sm bg-blue-100 text-blue-600 px-3 py-1 rounded-full">
                {user?.phoneNumber}
                </span>

                {/* ACTIONS */}
                <div className="flex gap-3 mt-4">
                <Button type="primary" onClick={() => setEditOpen(true)}>
                    Edit Profile
                </Button>
                <Button danger onClick={handleLogout}>
                    Logout
                </Button>
                </div>
            </div>
            </Card>
        </Content>

        {/* ================= EDIT MODAL ================= */}
        <Modal
            title="Edit Profile"
            open={editOpen}
            onOk={handleUpdateProfile}
            onCancel={() => setEditOpen(false)}
            okText="Save"
        >
            <label>Username</label>
            <Input
            value={editUsername}
            onChange={(e) => setEditUsername(e.target.value)}
            />

            <label className="mt-3 block">Phone Number</label>
            <Input
            value={editPhone}
            onChange={(e) => setEditPhone(e.target.value)}
            />
        </Modal>
        </Layout>
    );
}

export default Myprofile;
