import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api";

export default function Login() {
  const [form, setForm] = useState({ username: "", password: "" });
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const res = await API.post("/auth/login", form);
      localStorage.setItem("token", res.data.token);
      navigate("/");
    } catch (err: any) {
      alert(err.response?.data?.error || "Login failed");
    }
  };

  return (
    <div className="flex flex-col items-center mt-20">
      <input
        className="border p-2 mb-2"
        placeholder="Username"
        onChange={(e) => setForm({ ...form, username: e.target.value })}
      />
      <input
        type="password"
        className="border p-2 mb-2"
        placeholder="Password"
        onChange={(e) => setForm({ ...form, password: e.target.value })}
      />
      <button className="bg-blue-500 text-white p-2" onClick={handleLogin}>
        Login
      </button>
    </div>
  );
}
