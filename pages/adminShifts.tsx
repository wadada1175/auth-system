import withAuth from "../hoc/withAuth";
import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/router";

interface Shift {
  id: number;
  date: string;
  startTime: string;
  endTime: string;
  status: string;
}

function AdminShifts() {
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [shifts, setShifts] = useState<Shift[]>([]);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      axios
        .get("http://localhost:4000/me", {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((response) => {
          if (response.data.role !== "admin") {
            router.push("/dashboard"); // 管理者でない場合はダッシュボードにリダイレクト
          } else {
            setIsAdmin(true);
            fetchShifts(token); // シフトを取得
          }
        })
        .catch(() => {
          router.push("/login");
        });
    } else {
      router.push("/login");
    }
  }, [router]);

  const fetchShifts = (token: string) => {
    axios
      .get("http://localhost:4000/shifts", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        setShifts(response.data);
      })
      .catch(() => {
        setError("Failed to fetch shifts");
      });
  };

  const updateShiftStatus = async (id: number, status: string) => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        await axios.put(
          `http://localhost:4000/shifts/${id}`,
          { status },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setShifts(
          shifts.map((shift) =>
            shift.id === id ? { ...shift, status } : shift
          )
        );
      } catch (error) {
        setError("Failed to update shift status");
      }
    }
  };

  const toJST = (utcDate: string) => {
    const date = new Date(utcDate);
    return date.toLocaleString("ja-JP", { timeZone: "Asia/Tokyo" });
  };

  if (!isAdmin) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      <h1>Admin Shift Management</h1>
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
            {shift.status === "pending" && (
              <>
                <button onClick={() => updateShiftStatus(shift.id, "approved")}>
                  Approve
                </button>
                <button onClick={() => updateShiftStatus(shift.id, "rejected")}>
                  Reject
                </button>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default withAuth(AdminShifts);
