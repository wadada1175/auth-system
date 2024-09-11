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
      } else {
        axios
          .get("http://localhost:4000/me", {
            headers: { Authorization: `Bearer ${token}` },
          })
          .then(() => {
            setIsAuthenticated(true);
          })
          .catch(() => {
            router.push("/login");
          });
      }
    }, [router]);

    if (!isAuthenticated) {
      return <p>Loading...</p>;
    }

    return <Component />;
  };
}
