import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Card, Empty, Layout, Menu, Button } from "antd";
const { Header, Content } = Layout;
import logo from "../assets/logo.png";


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


    if (!bookings.length) {
        return <Empty description="No bookings yet" />;
    }

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
                <div className="p-6 grid grid-cols-2 gap-6">
        {bookings.map((b) => (
            <Card key={b._id} title={b.ride.from.name + " → " + b.ride.to.name}>
            <p><b>Driver:</b> {b.ride.user.username}</p>
            <p><b>Phone Number:</b> {b.ride.user.phoneNumber}</p>
            <p><b>Price:</b> ₹{b.ride.price}</p>
            <p><b>Status:</b> {b.status}</p>
            <p className="text-gray-500 text-sm">
                Booked on {new Date(b.createdAt).toLocaleDateString()}
            </p>
            </Card>
        ))}
        </div>
            </Content>
        </Layout>
    );
}

export default BookingDetails;
