import withAuth from "../hoc/withAuth";
import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/router";

function Admin() {
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    axios
      .get("http://localhost:4000/me", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        if (response.data.role !== "admin") {
          router.push("/dashboard"); // 管理者でない場合はダッシュボードにリダイレクト
        } else {
          setIsAdmin(true);
        }
      })
      .catch(() => {
        router.push("/login");
      });
  }, [router]);

  if (!isAdmin) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      <h1>Admin Page</h1>
      <p>Welcome, Admin!</p>
    </div>
  );
}

export default withAuth(Admin);
