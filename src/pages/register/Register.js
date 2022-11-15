import { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "./register.scss";

const Register = () => {
  const [ inputs , setInputs ] = useState({
    username: "",
    email: "",
    password: "",
    name: ""
  });
  const [err, setErr] = useState(null);

  const handleChange = (e) =>{
    setInputs(prev =>({...prev, [e.target.name]: e.target.value}));
  }

  const handleClick = async (e) =>{
    e.preventDefault();

    try {
      await axios.post("http://localhost:30000/api/auths/register", inputs)
    } catch (error) {
      setErr(error.response.data);
    }
  }

  return (
    <div className="register">
      <div className="card">
        <div className="left">
          <h1>Lama Social.</h1>
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Libero cum,
            alias totam numquam ipsa exercitationem dignissimos, error nam,
            consequatur.
          </p>
          <span>Do you have an account?</span>
          <Link to="/login">
            <button>Login</button>
          </Link>
        </div>
        <div className="right">
          <h1>Register</h1>
          <form>
            <input name="username" type="text" placeholder="Username" onChange={handleChange} />
            <input name="email" type="email" placeholder="Email" onChange={handleChange} />
            <input name="password" type="password" placeholder="Password" onChange={handleChange} />
            <input name="name" type="text" placeholder="Name" onChange={handleChange} />
            {err && <small style={{color:'red'}}>{err}</small>}
            <button onClick={handleClick}>Register</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
