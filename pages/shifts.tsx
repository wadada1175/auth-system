import { useEffect, useState } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { useRouter } from "next/router";

interface Shift {
  id: number;
  date: string;
  startTime: string;
  endTime: string;
  status: string;
}

interface DecodedToken {
  userId: number;
  role: string;
}

export default function Shifts() {
  const [shifts, setShifts] = useState<Shift[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [userId, setUserId] = useState<number | null>(null);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const decoded: DecodedToken = jwtDecode(token);
      setUserId(decoded.userId); // JWTからユーザーIDを取得
    } else {
      router.push("/login"); // トークンがなければログインページにリダイレクト
    }
  }, [router]);

  useEffect(() => {
    if (userId) {
      const token = localStorage.getItem("token");
      axios
        .get(`http://localhost:4000/shifts/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((response) => {
          setShifts(response.data);
        })
        .catch(() => {
          setError("Failed to fetch shifts");
        });
    }
  }, [userId]);

  const toJST = (utcDate: string) => {
    const date = new Date(utcDate);
    return date.toLocaleString("ja-JP", { timeZone: "Asia/Tokyo" });
  };

  return (
    <div>
      <h1>Your Shifts</h1>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <ul>
        {shifts.map((shift) => (
          <li key={shift.id}>
            {toJST(shift.date)} ({toJST(shift.startTime)} -{" "}
            {toJST(shift.endTime)}) -{" "}
            <span
              style={{
                color:
                  shift.status === "approved"
                    ? "green"
                    : shift.status === "rejected"
                    ? "red"
                    : "orange",
              }}
            >
              {shift.status === "pending" && "Pending"}
              {shift.status === "approved" && "Approved"}
              {shift.status === "rejected" && "Rejected"}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
