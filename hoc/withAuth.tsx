import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";

export default function withAuth(Component: React.ComponentType) {
  return function AuthenticatedComponent() {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    const router = useRouter();

    useEffect(() => {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/login");
        return;
      }

      axios
        .get("http://localhost:4000/me", {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((response) => {
          if (response.status === 200) {
            setIsAuthenticated(true);
          } else {
            localStorage.removeItem("token"); // 無効なトークンを削除
            router.push("/login");
          }
        })
        .catch((err) => {
          console.error(err);
          localStorage.removeItem("token"); // エラー発生時にトークンを削除
          router.push("/login");
        });
    }, [router]);

    if (!isAuthenticated) {
      return <p>Loading...</p>; // ログインチェック中の画面
    }

    return <Component />;
  };
}
