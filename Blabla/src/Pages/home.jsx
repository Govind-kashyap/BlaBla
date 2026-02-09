import { useEffect, useState } from "react";
import axios from "axios";
import { Breadcrumb, Layout, Menu, theme, Button, Form, DatePicker, InputNumber, AutoComplete, Card, message, Empty} from 'antd';
const { Header, Content, Footer } = Layout;
import { useNavigate } from 'react-router-dom';
import logo from "../assets/logo.png";
const API_URL = import.meta.env.VITE_API_URL;

const Home = () => {
    const navigate = useNavigate();

    const [rides, setRides] = useState([]);

    const [value, setValue] = useState();
    const [cities, setCities] = useState([]);
    const [fromOptions, setFromOptions] = useState([]);
    const [toOptions, setToOptions] = useState([]);

    const onChange = (newValue) => {
        console.log('changed', newValue);
        setValue(newValue);
    };

        useEffect(() => {
        axios
            .get(`${API_URL}/api/user/me`, { withCredentials: true })
            .catch(() => navigate("/login"));
        }, []);

    useEffect(() => {
    axios
        .get("/indianCities.json")
        .then(res => {
        setCities(res.data);
        })
        .catch(err => console.log(err));
    }, []);

    const handleFromSearch = (value) => {
    if (!value) {
        setFromOptions([]);
        return;
    }

    const filtered = cities
        .filter(city =>
        city.name.toLowerCase().includes(value.toLowerCase())
        )
        .slice(0, 10)
        .map(city => ({
        value: `${city.name}, ${city.state}`
        }));

    setFromOptions(filtered);
    };

    const handleToSearch = (value) => {
    if (!value) {
        setToOptions([]);
        return;
    }

    const filtered = cities
        .filter(city =>
        city.name.toLowerCase().includes(value.toLowerCase())
        )
        .slice(0, 10)
        .map(city => ({
        value: `${city.name}, ${city.state}`
        }));

    setToOptions(filtered);
    };

    const handleSearch = async (values) => {
    const fromCity = values.from.split(",")[0].trim();
    const toCity = values.to.split(",")[0].trim();
    const date = values.Date.format("YYYY-MM-DD");

  try {
    const res = await axios.get(
      `${API_URL}/api/user/search-rides`,
      {
        params: {
          from: fromCity,
          to: toCity,
          date
        },
        withCredentials: true,
      }
    );

    console.log(res.data.rides);
    setRides(res.data.rides);
  } catch (err) {
    console.log("Search error", err);
  }
};

const handleBookRide = async (rideId) => {
  try {
    await axios.post(
      `${API_URL}/api/user/book-ride/${rideId}`,
      {},
      { withCredentials: true }
    );

    message.success("Booking request sent. Waiting for driver approval");

  } catch (err) {
    message.error(
      err.response?.data?.message || "Booking failed"
    );
  }
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

    const items = [
        {
        key: "Ride",
        label: "Add Ride",
            onClick: () => navigate("/addRide"),
        },
        {
            key: "profile",
            label: "My Profile",
            onClick: () => navigate("/Myprofile"),
        },
        {
        key: "BookingRide",
        label: "Booking Ride",
            onClick: () => navigate("/bookings"),
        },
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

    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();
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
            <h1 className='text-white text-3xl font-bold'>
              <img src={logo} alt="BlaBla Logo" className="h-30 w-40 inline-block mr-2" />
            </h1>
            <div className="demo-logo">
            <Menu
            theme="dark"
            mode="horizontal"
            defaultSelectedKeys={['1']}
            items={items}
            style={{ flex: 1, minWidth: 0 }}
            />
            </div>
        </Header>
        <Content style={{ padding: '0 48px' }}>
            <Breadcrumb
            style={{ margin: '16px 0' }}
            />
            <div
            style={{
                padding: 24,
                minHeight: 480,
                background: colorBgContainer,
                borderRadius: borderRadiusLG,
            }}
            >
            
            <Form className='flex justify-between' onFinish={handleSearch}>
                <Form.Item
                    className='w-80'
                    label="From"
                    name="from"
                    rules={[{ required: true, message: 'From location required' }]}
                    >
                    <AutoComplete
                        options={fromOptions}
                        onSearch={handleFromSearch}
                        placeholder="Leaving from"
                    />
                </Form.Item>

                <Form.Item
                    className='w-80'
                    label="To"
                    name="to"
                    rules={[{ required: true, message: 'To location required' }]}
                    >
                    <AutoComplete
                        options={toOptions}
                        onSearch={handleToSearch}
                        placeholder="Going to"
                    />
                </Form.Item>

                <Form.Item
                    label="Date"
                    name="Date"
                    rules={[{ required: true, message: 'Date' }]}
                >
                    <DatePicker />
                </Form.Item>

                    <InputNumber
                        className='h-8'
                        min={1}
                        max={10}
                        onChange={onChange}
                        value={value}
                        placeholder="Pessanger"
                        step={1}
                    />
                
                <Button className='w-40 h-20' htmlType="submit">Search</Button>
            </Form>

          <div className="mt-10 grid grid-cols-3 gap-6 w-full">
            {rides && rides.length > 0 ? (
              rides.map((ride) => (
                <Card
                  key={ride._id}
                  className="w-[100vw] max-w-3xl rounded-xl shadow-md hover:shadow-lg transition"
                >
                  {/* TOP ROW */}
                  <div className="flex justify-between items-start w-full">
                    <div>
                      <div className="flex items-center gap-3 text-lg font-semibold">
                        <span>{ride.departure_time}</span>

                        <div className="w-[35vw] flex items-center gap-2 text-gray-500 text-sm">
                          <span className="w-2 h-2 border border-gray-400 rounded-full"></span>
                          <span className="w-54 border-t border-gray-400"></span>
                          <span>
                            {getDistanceInKm(
                              ride.from.latitude,
                              ride.from.longitude,
                              ride.to.latitude,
                              ride.to.longitude
                            ).toFixed(0)} km
                          </span>
                          <span className="w-54 border-t border-gray-400"></span>
                          <span className="w-2 h-2 border border-gray-400 rounded-full"></span>
                        </div>

                        <span className="font-semibold">{ride.departure_time}</span>
                      </div>

                      <div className="flex justify-between mt-1 text-sm font-medium">
                        <span>{ride.from.name}</span>
                        <span>{ride.to.name}</span>
                      </div>
                    </div>

                    <div className="text-xl font-bold text-green-700">
                      ₹{ride.price}
                    </div>
                  </div>

                  <hr className="my-4" />

                  {/* BOTTOM ROW */}
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center text-sm font-bold">
                        {ride.user?.name?.charAt(0)}
                      </div>

                      <div>
                        <p className="font-semibold flex items-center gap-2">
                          {ride.user?.name}
                          <span className="text-yellow-500 text-sm">★ 4.6</span>
                        </p>
                        <p className="text-xs text-gray-500">Instant Booking</p>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <Button size="large" onClick={() => navigate(`/ride/${ride._id}`)}>
                        View Details
                      </Button>

                      <Button
                        type="primary"
                        size="large"
                        onClick={() => handleBookRide(ride._id)}
                      >
                        Request Ride
                      </Button>
                    </div>
                  </div>
                </Card>
              ))
            ) : (
              <Empty className="self-center"/>
            )}
          </div>
            
            </div>
        </Content>
        <Footer style={{ textAlign: 'center' }}>
            Ant Design ©{new Date().getFullYear()} Created by Ant UED
        </Footer>
        </Layout>
    );
};
export default Home;