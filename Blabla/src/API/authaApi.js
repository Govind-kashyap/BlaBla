
import axios from "axios";
const API_URL = import.meta.env.VITE_API_URL;


export const Login_Form = async (data) => {
    try {
        const res = await axios.post(
            `${API_URL}/api/user/login`,
            data,
            { withCredentials: true}
        );

        return res.data;
    } catch (err) {
        return {
          success: false,
          message: err.response?.data?.message || "Something Went Wrong"
        };
    }
}


export const Register_form = async (data) => {
  try {
    const res = await axios.post(
      `${API_URL}/api/user/register`,
      data,
      { withCredentials: true }
    );
    return res.data;
  } catch (err) {
    return err.response?.data;
  }
};


export const logout = async () => {
        
  try {
    await axios.post(
      `${API_URL}/api/user/logout`,
      {withCredentials: true}
    );
    return {
      success: true,
      message: "Logged out successfully"
    }
  } catch (err){
    return {
      success: false,
      message : err.response?.data?.message || "logout Failed"
    }
  }
};