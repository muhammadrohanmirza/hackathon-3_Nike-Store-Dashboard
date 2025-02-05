"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { CgProfile } from "react-icons/cg";
import { RiLockPasswordFill } from "react-icons/ri";


export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const router = useRouter();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();


    if (email === "" && password === "") {
      localStorage.setItem("isLoggedIn", "true");
      router.push("/Admin/dashboard");
    } else {
      alert("Invalid email or password");
    }
    
  };


  return (
    <div className="body1">
      <div className="body2">
     
      <div className="wrapper">
        <span className="rotate-bg"></span>

        <div className="form-box login">
            <h2 className="title animation">Login</h2>
            <form action="#" onSubmit={handleLogin}>

                <div className="input-box animation" >
                <input
                  type="email"
                  
                  onChange={(e) => setEmail(e.target.value)}
                  value={email}
                />
                    <label htmlFor="">Email</label>
                    <i className='bx bxs-user'><CgProfile /></i>
                </div>

                <div className="input-box animation">
                <input
                    type="password"
                    onChange={(e) => setPassword(e.target.value)}
                   
                    value={password}
                  />
                    <label htmlFor="">Password</label>
                    <i className='bx bxs-lock-alt'><RiLockPasswordFill /></i>
                </div>
                <button type="submit" className="btn animation" >Login</button>
               <h1 className="mt-2 font-extrabold text-black text-center underline sm:hidden">Welcome Back! To Admin Dashboard
               </h1>
            </form>
        </div>

        <div className="info-text login">
            <h2 className="animation">Welcome Back!</h2>
            <p className="animation" >
                To Admin Dashboard
            </p>
        </div>
</div>

    </div>
      </div>

  );
}