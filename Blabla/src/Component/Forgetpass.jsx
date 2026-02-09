import { Form, Input, Button, message } from "antd";
import axios from "axios";
import { useState } from "react";
const API_URL = import.meta.env.VITE_API_URL;

const ForgotPassword = () => {
  const [loading, setLoading] = useState(false);  
  const [cooldown, setCooldown] = useState(0);  

  const passForget = async (v) => {

    if (loading || cooldown > 0) return;

    try {
      setLoading(true);

      const res = await axios.post(
        `${API_URL}/api/user/forgot-password`,
        v
      );

      if (res.data.success) {
        message.success("Reset link sent to email");

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
      message.error("Something went wrong",err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="flex flex-col w-[100vw] h-[100vh] justify-center items-center bg-blue-100">
        <Form onFinish={passForget}
        className="flex flex-col  bg-blue-300 w-[20vw] h-[40vh] justify-center items-center rounded-xl"
        >

      <Form.Item name="email" rules={[{ required: true }]}>
        <Input placeholder="Enter your email" 
        className="h-[5vh]"
        />
      </Form.Item>

      <Button
        htmlType="submit"
        loading={loading}
        disabled={cooldown > 0}
        className="h-[5vh]"
      >
        {cooldown > 0 ? `Resend in ${cooldown}s` : "Send Reset Link"}
      </Button>

      <p className="mt-2">Back To <a href="/login">Login</a></p>
    </Form>
    
      </div>
    </>
  );
};

export default ForgotPassword;
