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
    const [rides, setRides] = useState([]);


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
        fetchMyRides();
    }, []);

    const fetchMyRides = async () => {
    try {
        const res = await axios.get(
        `${API_URL}/api/user/my-rides`,
        { withCredentials: true }
        );

        setRides(res.data.rides);
    } catch (err) {
        console.log("Ride fetch error:", err);
    }
    };



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
        <Header className="flex justify-between items-center px-8 shadow-md">
        <div className="flex items-center gap-4">
            <img src={logo} alt="Logo" className="h-12" />
            <h1 className="text-white text-lg font-semibold">
            My Profile
            </h1>
        </div>

        <div className="flex items-center gap-4">
            <Menu theme="dark" mode="horizontal" items={items} />
            <Button type="primary" onClick={() => navigate("/home")}>
            Home
            </Button>
        </div>
        </Header>


        {/* CONTENT */}
        <Content className="flex flex-col justify-center items-center bg-gradient-to-br from-blue-50 to-gray-100 px-4 py-12">

        <Card className="w-full max-w-md shadow-2xl rounded-3xl p-8 border border-gray-100">

            <div className="flex flex-col items-center text-center gap-4">

            {/* PROFILE IMAGE */}
            <div className="relative group">

                <Avatar
                size={110}
                src={profileImage}
                className="cursor-pointer bg-gray-300 border-4 border-white shadow-lg"
                onClick={() => fileInputRef.current.click()}
                >
                {!profileImage && user?.username?.charAt(0)?.toUpperCase()}
                </Avatar>

                <div
                onClick={() => fileInputRef.current.click()}
                className="absolute inset-0 rounded-full bg-black/50 
                opacity-0 group-hover:opacity-100 transition duration-300
                flex items-center justify-center text-white text-sm font-medium cursor-pointer"
                >
                Change Photo
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
            <div className="mt-2">
                <h2 className="text-2xl font-bold text-gray-800">
                {user?.username}
                </h2>

                <p className="text-gray-500 mt-1">
                {user?.email}
                </p>

                <div className="mt-3 inline-block bg-blue-100 text-blue-600 px-4 py-1 rounded-full text-sm font-medium">
                {user?.phoneNumber}
                </div>
            </div>

            {/* ACTIONS */}
            <div className="flex gap-4 mt-6 w-full">
                <Button
                type="primary"
                className="flex-1 h-11 rounded-xl font-semibold shadow-md"
                onClick={() => setEditOpen(true)}
                >
                Edit Profile
                </Button>

                <Button
                danger
                className="flex-1 h-11 rounded-xl font-semibold"
                onClick={handleLogout}
                >
                Logout
                </Button>
            </div>

            </div>
        </Card>

        {/* ================= USER CREATED RIDES ================= */}
    <div className="w-full max-w-5xl mt-12">

    <h2 className="text-2xl font-bold mb-6 text-gray-800">
        My Created Rides
    </h2>

    {rides.length === 0 ? (
        <div className="text-gray-500 text-center py-10 bg-white rounded-xl shadow">
        No rides created yet
        </div>
    ) : (
        <div className="flex flex-col gap-6">

        {rides.map((ride) => (
            <Card
            key={ride._id}
            className="rounded-2xl shadow-md hover:shadow-lg transition border border-gray-100"
            >
            <div className="flex justify-between items-center">

                {/* LEFT SIDE */}
                <div>

                <div className="flex items-center gap-4 text-lg font-semibold">
                    <span>{ride.departure_time}</span>

                    <div className="flex items-center gap-2 text-gray-400 text-sm">
                    <span className="w-2 h-2 border border-gray-400 rounded-full"></span>
                    <span className="w-16 border-t border-gray-400"></span>
                    <span className="w-2 h-2 border border-gray-400 rounded-full"></span>
                    </div>

                    <span>{ride.departure_time}</span>
                </div>

                <div className="flex justify-between mt-2 text-sm font-medium text-gray-700">
                    <span>{ride.from.name}</span>
                    <span>{ride.to.name}</span>
                </div>

                <p className="text-xs text-gray-500 mt-1">
                    {ride.total_seat} Seats • {ride.date.slice(0, 10)}
                </p>

                </div>

                {/* PRICE */}
                <div className="text-2xl font-bold text-blue-600">
                ₹{ride.price}
                </div>

            </div>
            </Card>
        ))}

        </div>
    )}
    </div>


        </Content>


        {/* EDIT MODAL */}
        <Modal
        title="Edit Profile"
        open={editOpen}
        onOk={handleUpdateProfile}
        onCancel={() => setEditOpen(false)}
        okText="Save Changes"
        >
        <div className="flex flex-col gap-3">

            <div>
            <label className="font-medium">Username</label>
            <Input
                value={editUsername}
                onChange={(e) => setEditUsername(e.target.value)}
            />
            </div>

            <div>
            <label className="font-medium">Phone Number</label>
            <Input
                value={editPhone}
                onChange={(e) => setEditPhone(e.target.value)}
            />
            </div>

        </div>
        </Modal>

        

    </Layout>
);

}

export default Myprofile;
