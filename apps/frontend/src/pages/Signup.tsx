import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../lib/api";
import { useAuth } from "../contexts/AuthContext";
import { useToast } from "../contexts/ToastContext";

export default function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.post<{ token?: string }>(
        "/users",
        { name, email, password },
        false
      );
      if (res?.token) {
        auth.login(res.token);
        toast.addToast("Signed up successfully");
      }
      navigate("/");
    } catch (err) {
      console.error(err);
      const maybe = err as { body?: { message?: string } } | undefined;
      toast.addToast(maybe?.body?.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  const navigate = useNavigate();
  const auth = useAuth();
  const toast = useToast();

  return (
    <div style={{ maxWidth: 480, margin: "2rem auto" }}>
      <h2>Sign up</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Name</label>
          <input value={name} onChange={(e) => setName(e.target.value)} />
        </div>
        <div>
          <label>Email</label>
          <input value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <div>
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button type="submit" disabled={loading}>
          {loading ? "Signing up..." : "Sign up"}
        </button>
      </form>
    </div>
  );
}
