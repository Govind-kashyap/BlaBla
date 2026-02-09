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
        <div className="flex flex-col justify-center items-center w-full h-screen gap-10 bg-[#51a1bc] text-white font-bold">
        <Button onClick={() => navigate("/")}>Dashboard</Button>

        <div className="flex flex-col justify-center gap-6 p-20 bg-[#8bcfe2] rounded-xl w-[35vw] h-[80vh]">
            <h1 className="text-3xl text-center">Register Page</h1>

            <Form
            form={form}
            className="flex flex-col gap-5 w-full"
            onFinish={registeration_success}
            >
            <Form.Item
                label="Name"
                name="username"
                rules={[{ required: true, message: "Please input your Name" }]}
            >
                <Input />
            </Form.Item>

            <Form.Item
                label="Email"
                name="email"
                rules={[{ required: true, message: "Please input your Email" }]}
            >
                <Input />
            </Form.Item>

            <Form.Item
                label="Phone Number"
                name="phoneNumber"
                rules={[{ required: true, message: "Please input your Phone Number" }]}
            >
                <Input />
            </Form.Item>

            <Form.Item
                label="Password"
                name="password"
                rules={[{ required: true, message: "Please input your Password" }]}
            >
                <Input.Password />
            </Form.Item>

            <Form.Item
                label="Confirm Password"
                name="confirm_password"
                rules={[{ required: true, message: "Please confirm password" }]}
            >
                <Input.Password />
            </Form.Item>

            <Button htmlType="submit" className="w-[15vw] text-xl font-bold self-end">
                Register
            </Button>

            <p
                className="self-end hover:underline cursor-pointer"
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