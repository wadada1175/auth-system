import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import { jwtDecode } from "jwt-decode";

interface LoginResponse {
  token: string;
}

interface DecodedToken {
  userId: number;
  role: string;
}

export default function Login() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post<LoginResponse>(
        "http://localhost:4000/login",
        { email, password }
      );
      const token = response.data.token;
      localStorage.setItem("token", token);
      const decoded: DecodedToken = jwtDecode(token); // 修正ポイント
      console.log("Logged in as:", decoded.role);
      router.push("/dashboard"); // ダッシュボードへリダイレクト
    } catch (error) {
      console.error("Login failed", error);
      setError("Login failed. Please check your credentials.");
    }
  };

  return (
    <div>
      <h1>Login</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          required
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          required
        />
        <button type="submit">Login</button>
      </form>
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
}
