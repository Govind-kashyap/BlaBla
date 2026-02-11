import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Card, Empty, Layout, Menu, Button } from "antd";
const { Header, Content } = Layout;
import logo from "../assets/logo.png";
import { logout } from "../API/authaApi";


const API_URL = import.meta.env.VITE_API_URL;

function BookingDetails() {
    const navigate = useNavigate();
    const [bookings, setBookings] = useState([]);

    useEffect(() => {
        axios
        .get(`${API_URL}/api/user/my-bookings`, {
            withCredentials: true,
        })
        .then(res => setBookings(res.data.bookings))
        .catch(err => console.log(err));
    }, []);

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
            onClick: async () => {handleLogout()},
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
            <div className="flex flex-col items-center gap-6 p-6">
            {bookings.map((b) => (
                <Card
                key={b._id}
                className="w-full max-w-4xl rounded-xl shadow-md hover:shadow-lg transition"
                >
                {b.ride ? (
                    <>
                    {/* TOP SECTION */}
                    <div className="flex justify-between items-start w-full">
                        <div className="w-full">
                        <div className="flex items-center gap-3 text-lg font-semibold">
                            <span>{b.ride.departure_time}</span>

                            <div className="flex-1 flex items-center gap-2 text-gray-500 text-sm">
                            <span className="w-2 h-2 border border-gray-400 rounded-full"></span>
                            <span className="flex-1 border-t border-gray-400"></span>


                            <span className="flex-1 border-t border-gray-400"></span>
                            <span className="w-2 h-2 border border-gray-400 rounded-full"></span>
                            </div>

                            <span>{b.ride.departure_time}</span>
                        </div>

                        <div className="flex justify-between mt-1 text-sm font-medium">
                            <span>{b.ride.from?.name}</span>
                            <span>{b.ride.to?.name}</span>
                        </div>
                        </div>

                        <div className="text-xl font-bold text-green-700">
                        ₹{b.ride.price}
                        </div>
                    </div>

                    <hr className="my-4" />

                    {/* DRIVER + STATUS SECTION */}
                    <div className="flex justify-between items-center">
                        <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center text-sm font-bold">
                            {b.ride.user?.username?.charAt(0)}
                        </div>

                        <div>
                            <p className="font-semibold">
                            {b.ride.user?.username}
                            </p>
                            <p className="text-xs text-gray-500">
                            {b.ride.user?.phoneNumber}
                            </p>
                        </div>
                        </div>

                        <div className="text-right">
                        <p className="text-sm text-gray-500">
                            Booked on {new Date(b.createdAt).toLocaleDateString()}
                        </p>

                        <p
                            className={`mt-1 px-3 py-1 rounded-full text-sm font-semibold inline-block
                            ${
                            b.status === "approved"
                                ? "bg-green-100 text-green-700"
                                : b.status === "rejected"
                                ? "bg-red-100 text-red-700"
                                : "bg-yellow-100 text-yellow-700"
                            }`}
                        >
                            {b.status.toUpperCase()}
                        </p>
                        </div>
                    </div>
                    </>
                ) : (
                    <div className="text-center py-6">
                    <p className="text-red-500 font-semibold">
                        This ride has been deleted by the driver.
                    </p>
                    <p className="text-sm text-gray-500">
                        Booking Date: {new Date(b.createdAt).toLocaleDateString()}
                    </p>
                    </div>
                )}
                </Card>
            ))}
            </div>

            </Content>
        </Layout>
    );
}

export default BookingDetails;
