import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/router";

interface User {
  email: string;
  role: string;
}

export default function Dashboard() {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      // トークンがない場合、ログインページにリダイレクト
      router.push("/login");
    } else {
      // ユーザー情報を取得する
      axios
        .get("http://localhost:4000/me", {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((response) => {
          setUser(response.data);
        })
        .catch(() => {
          // 認証が失敗した場合はログインページにリダイレクト
          router.push("/login");
        });
    }
  }, [router]);

  if (!user) {
    return <p>Loading...</p>; // 認証中はローディングを表示
  }

  return (
    <div>
      <h1>Dashboard</h1>
      <p>Welcome, {user.email}!</p>
      <p>Your role: {user.role}</p>
    </div>
  );
}
