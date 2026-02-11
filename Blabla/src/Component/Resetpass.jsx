import { Form, Input, Button, message } from "antd";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { useState } from "react";

const API_URL = import.meta.env.VITE_API_URL;

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const passReset = async (values) => {
    try {
      setLoading(true);

      const res = await axios.post(
        `${API_URL}/api/user/reset-password/${token}`,
        values
      );

      if (res.data.success) {
        message.success("Password updated successfully");

        setTimeout(() => {
          navigate("/login", { replace: true });
        }, 1500);
      } else {
        message.error(res.data.message);
      }
    } catch (error) {
      message.error("Something went wrong");
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-[#001529] px-4">

      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8">

        <h1 className="text-2xl font-bold text-center text-[#001529] mb-6">
          Reset Password
        </h1>

        <Form
          layout="vertical"
          onFinish={passReset}
          className="flex flex-col gap-3"
        >
          <Form.Item
            label="New Password"
            name="password"
            rules={[
              { required: true, message: "Please enter new password" },
              { min: 6, message: "Minimum 6 characters required" },
            ]}
            hasFeedback
          >
            <Input.Password size="large" placeholder="Enter new password" />
          </Form.Item>

          <Form.Item
            label="Confirm Password"
            name="confirmPassword"
            dependencies={["password"]}
            hasFeedback
            rules={[
              { required: true, message: "Please confirm password" },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("password") === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(
                    new Error("Passwords do not match")
                  );
                },
              }),
            ]}
          >
            <Input.Password size="large" placeholder="Confirm new password" />
          </Form.Item>

          <Button
            htmlType="submit"
            type="primary"
            size="large"
            loading={loading}
            className="w-full mt-2"
          >
            Reset Password
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

export default ResetPassword;
