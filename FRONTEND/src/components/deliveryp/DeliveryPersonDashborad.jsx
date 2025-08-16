import { Link, Outlet, useNavigate } from "react-router-dom";
const DeliveryPersonDashborad =()=>{

const navigate=useNavigate();
    const logout = () => {
        localStorage.removeItem("token");
        navigate("/")
       }

    return(
        <>
            <h1>THis is a RecruiterDashborad page <span style={{ color: "blue",cursor:"pointer" }}> <a onClick={logout}>LogOut</a></span></h1>
        </>
    )
}
export default DeliveryPersonDashborad;