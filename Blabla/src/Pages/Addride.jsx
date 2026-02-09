import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";

import {
    Button,
    DatePicker,
    Form,
    Input,
    Layout,
    Menu,
    TimePicker,
    message,
    Card,
    AutoComplete
} from "antd";

const API_URL = import.meta.env.VITE_API_URL;
const { Header, Content } = Layout;

const formItemLayout = {
    labelCol: { xs: { span: 24 }, sm: { span: 6 } },
    wrapperCol: { xs: { span: 24 }, sm: { span: 14 } },
    };

    const getDistanceInKm = (lat1, lon1, lat2, lon2) => {
    const toRad = (value) => (value * Math.PI) / 180;

    const R = 6371; // Earth radius in KM
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);

    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(toRad(lat1)) *
        Math.cos(toRad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
    };


    const AddRide = () => {
        const [fromOptions, setFromOptions] = useState([]);
        const [toOptions, setToOptions] = useState([]);
        const [cities, setCities] = useState([]);
        const [fromCity, setFromCity] = useState(null);
        const [toCity, setToCity] = useState(null);
        const [bookings, setBookings] = useState([]);


    const [rides, setRides] = useState([]);
    const [form] = Form.useForm();
    const navigate = useNavigate();

    useEffect(() => {
    axios
        .get(`${API_URL}/api/user/me`, { withCredentials: true })
        .catch(() => navigate("/login"));
    }, []);

    const [loadingCities, setLoadingCities] = useState(true);

    useEffect(() => {
    axios
        .get("/indianCities.json")
        .then((res) => {
        setCities(res.data);
        })
        .catch(() => {
        message.error("Failed to load cities");
        })
        .finally(() => setLoadingCities(false));
    }, []);


    const fetchRides = async () => {
        try {
        const res = await axios.get(
            `${API_URL}/api/user/my-rides`,
            { withCredentials: true }
        );
        setRides(res.data.rides);
        } catch (err) {
        console.log("Fetch rides error", err);
        }
    };

    useEffect(() => {
        fetchRides();
    }, []);

const onFinish = async (values) => {

    if (!fromCity || !toCity) {
        message.error("Please select valid cities from dropdown");
        return;
    }

    try {
        await axios.post(
        `${API_URL}/api/user/addRide`,
        {
            from: {
            name: values.From,
            latitude: Number(fromCity.lat),
            longitude: Number(fromCity.lon),
            },
            to: {
            name: values.TO,
            latitude: Number(toCity.lat),
            longitude: Number(toCity.lon),
            },
            price: Number(values.Price),
            total_seat: Number(values.Total_Seats),
            date: values.Date.format("YYYY-MM-DD"),
            departure_time: values.Departure_time.format("HH:mm"),
        },
        { withCredentials: true }
        );

        message.success("Ride created successfully");

        form.resetFields();
        setFromCity(null);
        setToCity(null);
        fetchRides();

    } catch (err) {
        if (err.response?.data?.message) {
        message.error(err.response.data.message);
        } else {
        message.error("Something went wrong");
        }
    }
    };


        const handleDelete = async (rideId) => {
    try {
        await axios.delete(
        `${API_URL}/api/user/ride/${rideId}`,
        { withCredentials: true }
        );

        message.success("Ride deleted successfully");

        setRides((prev) => prev.filter((ride) => ride._id !== rideId));

    } catch (err) {
        if (err.response?.data?.message) {
        message.error(err.response.data.message);
        } else {
        message.error("Failed to delete ride");
        }
    }
    };


    const handleFromSearch = (value) => {
    if (!value) {
        setFromOptions([]);
        return;
    }

    const filtered = cities
        .filter(city => {
        if (toCity && isSameCity(city, toCity)) return false;

        return city.name.toLowerCase().includes(value.toLowerCase());
        })
        .slice(0, 10)
        .map(city => ({
        value: `${city.name}, ${city.state}`,
        cityObj: city
        }));

    setFromOptions(filtered);
    };

    const isSameCity = (a, b) => {
    if (!a || !b) return false;
    return a.name === b.name && a.state === b.state;
    };



    const handleToSearch = (value) => {
    if (!value) {
        setToOptions([]);
        return;
    }

    const filtered = cities
        .filter(city => {
        if (toCity && isSameCity(city, toCity)) return false;

        return city.name.toLowerCase().includes(value.toLowerCase());
        })
        .slice(0, 10)
        .map(city => ({
        value: `${city.name}, ${city.state}`,
        cityObj: city
        }));

    setToOptions(filtered);
    };

    const fetchDriverBookings = async () => {
        try {
            const res = await axios.get(
            `${API_URL}/api/user/driver-bookings`,
            { withCredentials: true }
            );
            setBookings(res.data.bookings);
        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        fetchDriverBookings();
    }, []);


    const updateBookingStatus = async (bookingId, status) => {
        console.log("bookingID",bookingId);
    try {
        await axios.put(
        `${API_URL}/api/user/booking/${bookingId}`,
        { status },
        { withCredentials: true }
        );

        message.success(`Booking ${status}`);
        fetchDriverBookings();
    } catch (err) {
        message.error("Failed to update booking",err);
    }
    };




    const items = [
        {
        key: "profile",
        label: "My Profile",
        onClick: () => navigate("/Myprofile"),
        },
        {
        key: "logout",
        label: "Logout",
        onClick: async () => {
            await axios.post(
            `${API_URL}/api/user/logout`,
            {},
            { withCredentials: true }
            );
            navigate("/login");
        },
        },
    ];

    return (
        <Layout>
        <Header className="flex items-center justify-between">
            <img src={logo} alt="BlaBla Logo" className="h-30 w-40 inline-block mr-2" />
            <div className="flex ml-10 h-10 items-center">
                <Menu theme="dark" mode="horizontal" items={items} />
            <Button
            onClick={() => navigate("/home")}
            >
            Back To Home
            </Button>
            </div>
        </Header>

        <Content className="flex flex-col items-center p-10 gap-10">

            <Form
            {...formItemLayout}
            form={form}
            onFinish={onFinish}
            className="w-[30vw]"
            >
            <Form.Item
            label="From"
            name="From"
            rules={[{ required: true, message: "From location required" }]}
            >
                <AutoComplete
                style={{ width: "100%" }}
                disabled={loadingCities}
                options={fromOptions}
                onSearch={handleFromSearch}
                onSelect={(value, option) => {
                    setFromCity(option.cityObj);
                }}
                filterOption={false}
                getPopupContainer={(trigger) => trigger.parentElement}
                placeholder="Leaving from"
            />
            </Form.Item>


            <Form.Item
                label="To"
                name="TO"
                rules={[{ required: true, message: "To location required" }]}
                >
                <AutoComplete
                style={{ width: "100%" }}
                disabled={loadingCities}
                options={toOptions}
                onSearch={handleToSearch}
                onSelect={(value, option) => {
                    setToCity(option.cityObj);
                }}
                filterOption={false}
                getPopupContainer={(trigger) => trigger.parentElement}
                placeholder="Going to"
                />
            </Form.Item>


            <Form.Item
                label="Price"
                name="Price"
                rules={[{ required: true }]}
            >
                <Input />
            </Form.Item>

            <Form.Item
                label="Seat"
                name="Total_Seats"
                rules={[{ required: true }]}
            >
                <Input />
            </Form.Item>

            <Form.Item
                label="Date"
                name="Date"
                rules={[{ required: true }]}
            >
                <DatePicker 
                disabledDate={(current) => 
                current && current < new Date().setHours(0, 0, 0, 0)
                }
                />
            </Form.Item>

            <Form.Item
                label="Time"
                name="Departure_time"
                rules={[{ required: true }]}
            >
                <TimePicker
                format="HH:mm"
                disabledTime={(current) => 
                current && current < new Date().setHours(0, 0, 0, 0)
                }
                />
            </Form.Item>

            <Form.Item>
                <Button type="primary" htmlType="submit">
                Submit Ride
                </Button>
            </Form.Item>
            </Form>

            <Card className="w-full">
            <h2 className="text-xl font-bold mb-6 text-center">
                My Created Rides
            </h2>

            <div className="grid grid-cols-3 gap-x-6 gap-y-6 justify-items-center">
                {rides.map((ride) => (
                <div className="bg-[#8bcfe2] grid grid-cols-2 gap-x-4 gap-y-2 p-4 rounded-xl">
                    <span className="font-semibold text-right">From:</span>
                    <span>{ride.from.name}</span>

                    <span className="font-semibold text-right">To:</span>
                    <span>{ride.to.name}</span>

                    <span className="font-semibold text-right">Distance:</span>
                    <span>
                        {getDistanceInKm(
                        ride.from.latitude,
                        ride.from.longitude,
                        ride.to.latitude,
                        ride.to.longitude
                        ).toFixed(1)} km
                    </span>

                    <span className="font-semibold text-right">Date:</span>
                    <span>{ride.date.slice(0, 10)}</span>

                    <span className="font-semibold text-right">Time:</span>
                    <span>{ride.departure_time}</span>

                    <span className="font-semibold text-right">Price:</span>
                    <span>₹{ride.price}</span>

                    <span className="font-semibold text-right">Seats:</span>
                    <span>{ride.total_seat}</span>

                    <span className="font-semibold text-right">Status:</span>
                    {/* <span>{ride.ride_status}</span> */}

                    <div className="col-span-2 mt-3">
                        <h3 className="font-bold mb-2">Booking Requests</h3>

                        {bookings.filter(b => b.ride._id === ride._id).length === 0 ? (
                            <p className="text-sm text-gray-600">No booking requests</p>
                        ) : (
                            bookings
                            .filter(b => b.ride._id === ride._id)
                            .map((booking) => (
                                <div
                                key={booking._id}
                                className="bg-white p-3 rounded-lg mb-2"
                                >
                                <p><b>Passenger:</b> {booking.user.username}</p>
                                <p><b>Phone:</b> {booking.user.phoneNumber}</p>
                                <p>
                                    <b>Status:</b>{" "}
                                    <span className="font-semibold">
                                    {booking.status}
                                    </span>
                                </p>

                                {booking.status === "pending" && (
                                    <div className="flex gap-3 mt-2">
                                    <Button
                                        type="primary"
                                        onClick={() =>
                                        updateBookingStatus(booking._id, "approved")
                                        }
                                    >
                                        Accept
                                    </Button>

                                    <Button
                                        danger
                                        onClick={() =>
                                        updateBookingStatus(booking._id, "rejected")
                                        }
                                    >
                                        Reject
                                    </Button>
                                    </div>
                                )}
                                </div>
                            ))
                        )}
                    </div>

                    <Button 
                    danger 
                    className="mt-3 self-center" 
                    onClick={() => handleDelete(ride._id)} 
                    > 
                    Delete Ride </Button>
                </div>

                ))}
            </div>
            </Card>
        </Content>
        </Layout>
    );
};

export default AddRide;
