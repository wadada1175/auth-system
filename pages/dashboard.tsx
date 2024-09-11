import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import withAuth from "../hoc/withAuth";

interface User {
  email: string;
  role: string;
}

function Dashboard() {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      axios
        .get("http://localhost:4000/me", {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((response) => {
          setUser(response.data);
        })
        .catch(() => {
          router.push("/login");
        });
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("token"); // トークンを削除
    router.push("/login"); // ログインページへリダイレクト
  };

  if (!user) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      <h1>Dashboard</h1>
      <p>Welcome, {user.email}!</p>
      <p>Your role: {user.role}</p>
      <button onClick={handleLogout}>Logout</button> {/* ログアウトボタン */}
    </div>
  );
}

// `withAuth` HOCで認証保護を追加
export default withAuth(Dashboard);
