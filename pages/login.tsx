import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/router";

export default function Login() {
  const [staffNumber, setStaffNumber] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:4000/login", {
        staffNumber,
        password,
      });
      const { token } = response.data;
      localStorage.setItem("token", token);
      router.push("/dashboard");
    } catch (error) {
      setError("Login failed. Please check your staff number and password.");
      localStorage.removeItem("token");
    }
  };

  return (
    <div>
      <h1>Login</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Staff Number:
          <input
            type="text"
            value={staffNumber}
            onChange={(e) => setStaffNumber(e.target.value)}
            required
          />
        </label>
        <br />
        <label>
          Password:
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>
        <br />
        <button type="submit">Login</button>
      </form>
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
}
