import { Form, Input, Button, message } from "antd";
import { useNavigate } from "react-router-dom";
import { Login_Form } from "../API/authaApi";

function Login() {
    const navigate = useNavigate();
    const [form] = Form.useForm();

    const Login_success = async (v) => {
        try {
        const { email, password } = v;

        const res = await Login_Form({ email, password });

        if (res.success) {
            message.success("Login Successfully");
            navigate("/home", { replace: true });
        } else {
            message.error(res?.message || "Login Failed");
        }
        } catch (error) {
        message.error("Something went wrong");
        console.log(error);
        }
    };

    return (
        <div className="min-h-screen flex justify-center items-center bg-[#001529] px-4">

        {/* Dashboard Button */}
        <div className="absolute top-6 left-6">
            <Button onClick={() => navigate("/")}>
            Dashboard
            </Button>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8">

            <h1 className="text-3xl font-bold text-center text-[#001529] mb-6">
            Welcome Back
            </h1>

            <Form
            form={form}
            layout="vertical"
            className="flex flex-col gap-2"
            onFinish={Login_success}
            >
            <Form.Item
                label="Email"
                name="email"
                rules={[
                { required: true, message: "Please input your Email!" },
                { type: "email", message: "Enter valid email" },
                ]}
            >
                <Input size="large" placeholder="Enter your email" />
            </Form.Item>

            <Form.Item
                label="Password"
                name="password"
                rules={[
                { required: true, message: "Please input your Password!" },
                ]}
            >
                <Input.Password size="large" placeholder="Enter password" />
            </Form.Item>

            <Button
                htmlType="submit"
                type="primary"
                size="large"
                className="w-full mt-4 font-semibold"
            >
                Login
            </Button>

            <div className="flex justify-between mt-3 text-sm">
                <p
                onClick={() => navigate("/forgot-password")}
                className="text-blue-600 hover:underline cursor-pointer"
                >
                Forgot Password?
                </p>

                <p
                onClick={() => navigate("/register")}
                className="text-blue-600 hover:underline cursor-pointer"
                >
                Create Account
                </p>
            </div>
            </Form>
        </div>
        </div>
    );
}

export default Login;
