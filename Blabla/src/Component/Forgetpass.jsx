import { Form, Input, Button, message } from "antd";
import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL;

const ForgotPassword = () => {
  const [loading, setLoading] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const navigate = useNavigate();

  const passForget = async (v) => {
    if (loading || cooldown > 0) return;

    try {
      setLoading(true);

      const res = await axios.post(
        `${API_URL}/api/user/forgot-password`,
        v
      );

      if (res.data.success) {
        message.success("Reset link sent to your email");

        // Redirect after 2 seconds
        setTimeout(() => {
          navigate("/login", { replace: true });
        }, 2000);

        // Cooldown Timer
        setCooldown(30);
        const timer = setInterval(() => {
          setCooldown((prev) => {
            if (prev <= 1) {
              clearInterval(timer);
              return 0;
            }
            return prev - 1;
          });
        }, 1000);

      } else {
        message.error(res.data.message);
      }
    } catch (err) {
      message.error("Something went wrong");
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-[#001529] px-4">

      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8">

        <h1 className="text-2xl font-bold text-center text-[#001529] mb-6">
          Forgot Password
        </h1>

        <Form
          layout="vertical"
          onFinish={passForget}
          className="flex flex-col gap-3"
        >
          <Form.Item
            label="Email Address"
            name="email"
            rules={[
              { required: true, message: "Please enter your email" },
              { type: "email", message: "Enter valid email" },
            ]}
          >
            <Input
              size="large"
              placeholder="Enter your registered email"
            />
          </Form.Item>

          <Button
            htmlType="submit"
            type="primary"
            size="large"
            loading={loading}
            disabled={cooldown > 0}
            className="w-full mt-2"
          >
            {cooldown > 0
              ? `Resend in ${cooldown}s`
              : "Send Reset Link"}
          </Button>

          <p
            className="text-center mt-3 text-blue-600 hover:underline cursor-pointer"
            onClick={() => navigate("/login")}
          >
            Back to Login
          </p>
        </Form>

      </div>
    </div>
  );
};

export default ForgotPassword;
