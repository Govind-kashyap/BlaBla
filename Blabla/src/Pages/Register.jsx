import { Form, Input, Button, message } from "antd";
import { useNavigate } from "react-router-dom";
import { Register_form } from "../API/authaApi";

function Register() {
    const navigate = useNavigate();
    const [form] = Form.useForm();

    const registeration_success = async (v) => {
        try {
        const { username, email, password, phoneNumber, confirm_password } = v;

        if (password !== confirm_password) {
            return message.error("Password Do Not Match");
        }

        const data = {
            username,
            email,
            phoneNumber,
            password,
            rating: 0,
        };

        const res = await Register_form(data);

        if (res?.success) {
            message.success("Registration successful");
            navigate("/login", { replace: true });
        } else {
            message.error(res?.message || "Registration Failed");
        }
        } catch (error) {
        message.error("Something went wrong");
        console.error(error);
        }
    };

    return (
        <div className="min-h-screen flex flex-col justify-center items-center bg-[#001529] px-2">

        {/* Dashboard Button */}
        <div className="absolute top-6 left-6">
            <Button onClick={() => navigate("/")}>
            Dashboard
            </Button>
        </div>

        {/* Register Card */}
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-5">

            <h1 className="text-3xl font-bold text-center text-[#001529] mb-6">
            Create Account
            </h1>

            <Form
            form={form}
            layout="vertical"
            className="flex flex-col gap-2"
            onFinish={registeration_success}
            >
            <Form.Item
                label="Name"
                name="username"
                rules={[{ required: true, message: "Please input your Name" }]}
            >
                <Input placeholder="Enter your name" size="large" />
            </Form.Item>

            <Form.Item
                label="Email"
                name="email"
                rules={[{ required: true, message: "Please input your Email" }]}
            >
                <Input placeholder="Enter your email" size="large" />
            </Form.Item>

            <Form.Item
                label="Phone Number"
                name="phoneNumber"
                rules={[{ required: true, message: "Please input your Phone Number" }]}
            >
                <Input placeholder="Enter phone number" size="large" />
            </Form.Item>

            <Form.Item
                label="Password"
                name="password"
                rules={[{ required: true, message: "Please input your Password" }]}
            >
                <Input.Password placeholder="Enter password" size="large" />
            </Form.Item>

            <Form.Item
                label="Confirm Password"
                name="confirm_password"
                dependencies={["password"]}
                rules={[
                { required: true, message: "Please confirm password" },
                ({ getFieldValue }) => ({
                    validator(_, value) {
                    if (!value || getFieldValue("password") === value) {
                        return Promise.resolve();
                    }
                    return Promise.reject(new Error("Passwords do not match"));
                    },
                }),
                ]}
            >
                <Input.Password placeholder="Confirm password" size="large" />
            </Form.Item>

            <Button
                htmlType="submit"
                type="primary"
                size="large"
                className="w-full mt-4 font-semibold"
            >
                Register
            </Button>

            <p
                className="text-center mt-3 text-blue-600 hover:underline cursor-pointer"
                onClick={() => navigate("/login")}
            >
                Already have an account?
            </p>
            </Form>

        </div>
        </div>

    );
}

export default Register;