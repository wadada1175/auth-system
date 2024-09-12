import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import withAuth from "../hoc/withAuth";
import Link from "next/link";

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
      <Link href="/adminShifts">Admin Shifts</Link>{" "}
      {/* 管理者用シフトページへのリンク */}
      <Link href="/shifts">シフト確認</Link>{" "}
      {/* ユーザー用シフトページへのリンク */}
      <Link href="/submitShift">シフト提出</Link>{" "}
      {/* シフト提出ページへのリンク */}
    </div>
  );
}

// `withAuth` HOCで認証保護を追加
export default withAuth(Dashboard);
