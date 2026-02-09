import { Form, Input, Button, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import {Login_Form} from '../API/authaApi'

function Login(){
    const navigate = useNavigate();
    const [form] = Form.useForm();

    const Login_success = async (v) =>{
        try {
            const {email, password} = v;
            const data = {
                email,
                password,
            }

            const res = await Login_Form(data);

            if(res.success){
                message.success("Login Successfully");
                navigate("/home", {replace: true});
            } else {
                message.error(res?.message || "Login Failed");
            } 
        } catch (error) {
            message.error("Something went wrong");
            console.log(error);
        }
    }

    return (
        <>
        <div className="flex flex-col justify-center items-center w-[100%] h-[100vh] gap-10 bg-[#51a1bc] text-white font-bold">
        <Button
        onClick={() => navigate("/")}
        >
            Dashboard
        </Button>
            <div className='items-center flex flex-col justify-center gap-15 p-20 bg-[#8bcfe2] rounded-xl w-[40vw] h-[55vh]'>
                <h1 className='text-3xl'>Login Page</h1>
        <Form className="flex flex-col gap-5 cursur-pointer w-[25vw]"
        form={form}
        onFinish={Login_success}
        >
            <Form.Item
                label="Email"
                name="email"
                rules={[{ required: true, message: 'Please input your UserGmail!' }]}
                >
                <Input className='w-[30vw] h-[5vh]'/>
            </Form.Item>

            <Form.Item
                label="Pass"
                name="password"
                rules={[{ required: true, message: 'Please input your User Password!' }]}
                >
                <Input.Password className='w-[30vw] h-[5vh]'/>
            </Form.Item>

            <div className='flex flex-col'>
                <Button className='w-[15vw] text-xl font-bold place-self-end' htmlType="submit">Login</Button>
            <p 
            onClick={() => navigate("/forgot-password")}
            className='place-self-end hover:underline cursor-pointer hover:text-white'>Forget Password?</p>
            </div>
        </Form>
            </div>
        </div>
        </>
    )
}

export default Login;