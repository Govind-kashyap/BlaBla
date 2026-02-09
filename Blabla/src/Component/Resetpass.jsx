import { Form, Input, Button, message } from "antd";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
const API_URL = import.meta.env.VITE_API_URL;

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();

  const passReset = async (v) => {
    const res = await axios.post(
      `${API_URL}/api/user/reset-password/${token}`,
      v
    );

    if (res.data.success) {
      message.success("Password updated");
      navigate("/login");
    } else {
      message.error(res.data.message);
    }
  };

  return (
    <div className="flex flex-col w-[100vw] h-[100vh] justify-center items-center bg-blue-100">
      <Form onFinish={passReset}
      className="flex flex-col  bg-blue-300 w-[20vw] h-[40vh] justify-center items-center rounded-xl"
      >
      <Form.Item name="password" rules={[{ required: true }]}>
        <Input.Password placeholder="New Password" />
      </Form.Item>
      <Button htmlType="submit">Reset Password</Button>
    </Form>
    </div>
  );
};

export default ResetPassword;