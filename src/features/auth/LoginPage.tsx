import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./hooks/useAuth";

export default function LoginPage() {
  const [name, setName] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    login(name);
    navigate("/");
  }

  return (
    <div className="p-6 max-w-md mx-auto">
      <h1 className="text-xl font-semibold mb-4">Login</h1>

      <form onSubmit={handleLogin} className="space-y-3">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter your name"
          className="w-full border p-2 rounded"
        />

        <button className="bg-black text-white px-4 py-2 rounded">
          Login
        </button>
      </form>
    </div>
  );
}