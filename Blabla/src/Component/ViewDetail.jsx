import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { Card, Button, message, Layout, Menu } from "antd";
const { Header, Content } = Layout;
import logo from "../assets/logo.png";
import { logout } from "../API/authaApi";

const API_URL = import.meta.env.VITE_API_URL;

const getDistanceInKm = (lat1, lon1, lat2, lon2) => {
  const toRad = (v) => (v * Math.PI) / 180;
  const R = 6371;

  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) ** 2;

  return R * (2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));
};

const ViewDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [ride, setRide] = useState(null);

  useEffect(() => {
    axios
      .get(`${API_URL}/api/user/ride/${id}`, { withCredentials: true })
      .then((res) => setRide(res.data.ride))
      .catch(() => message.error("Failed to load ride"));
  }, [id]);

  const handleBookRide = async () => {
    try {
      await axios.post(
        `${API_URL}/api/user/book-ride/${id}`,
        {},
        { withCredentials: true }
      );
      message.success("Ride booked successfully 🚗");
    } catch (err) {
      message.error(err.response?.data?.message || "Booking failed");
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

  if (!ride) return <p className="p-10">Loading...</p>;

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
            <h1 className='text-white text-3xl font-bold'>BlaBla</h1>
            <div className="flex ml-10 h-10 items-center">
            <Menu
            theme="dark"
            mode="horizontal"
            defaultSelectedKeys={['1']}
            items={items}
            style={{ flex: 1, minWidth: 0 }}
            />
            <img src={logo} alt="BlaBla Logo" className="h-30 w-40 inline-block mr-2" />
            <Button
            onClick={() => {
                navigate("/home");
            }}
            >Back To Home</Button>
            </div>
        </Header>
      <div className="p-10 flex justify-center">
      <Card className="w-full max-w-3xl rounded-xl shadow-lg">
        <h2 className="text-2xl font-bold mb-4">
          {ride.from.name} → {ride.to.name}
        </h2>

        <p><b>Date:</b> {ride.date.slice(0, 10)}</p>
        <p><b>Departure:</b> {ride.departure_time}</p>

        <p className="mt-2">
          <b>Distance:</b>{" "}
          {getDistanceInKm(
            ride.from.latitude,
            ride.from.longitude,
            ride.to.latitude,
            ride.to.longitude
          ).toFixed(1)} km
        </p>

        <p className="mt-2"><b>Price:</b> ₹{ride.price}</p>
        <p><b>Seats Available:</b> {ride.total_seat}</p>

        <hr className="my-4" />

        <h3 className="font-semibold text-lg">Driver Details</h3>
        <p><b>Name:</b> {ride.user?.username}</p>
        <p><b>Phone:</b> {ride.user?.phoneNumber}</p>

        <div className="flex gap-4 mt-6">
          <Button onClick={() => navigate(-1)}>
            Back
          </Button>

          <Button type="primary" size="large" onClick={handleBookRide}>
            Book Ride
          </Button>
        </div>
      </Card>
    </div>
    </Layout>
  );
};

export default ViewDetail;
