import { useRef } from "react";
import axios from "axios";
const Register = ()=>{
    const ref1 = useRef(null); // username
    const ref2 = useRef(null); // password
    const ref3 = useRef(null); // role
    const ref4 = useRef(null); // firstName
    const ref5 = useRef(null); // lastName
    const register = async ()=>{
        const res = await axios.post("http://localhost:9090/admin/register", {
            username: ref1.current.value,
            password: ref2.current.value,
            role: ref3.current.value,
            firstName: ref4.current.value,
            lastName: ref5.current.value
        },{
            headers:{
               "Authorization":`Bearer ${localStorage.getItem('token')}`
            }
        });
        const {data} = res;
        if(data!=null){
            alert("Registration Success !!!");
        }else{
            alert("Registration Fail !!!");
        }
    }
    return(
        <>
            <input type="text" ref={ref4} placeholder="Enter first name"></input>
            <br></br><br></br>
            <input type="text" ref={ref5} placeholder="Enter last name"></input>
            <br></br><br></br>
            <input type="text" ref={ref1} placeholder="Enter username"></input>
            <br></br><br></br>
            <input type="password" ref={ref2} placeholder="Enter password"></input>
            <br></br><br></br>
            <input type="text" ref={ref3} placeholder="Enter role"></input>
            <br></br><br></br>
            <button onClick={register}>Register</button>
        </>
    )
}
export default Register;