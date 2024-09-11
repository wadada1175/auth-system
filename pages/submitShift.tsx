import { useState, useEffect } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { useRouter } from "next/router";

interface DecodedToken {
  userId: number;
  role: string;
}

export default function SubmitShift() {
  const [date, setDate] = useState<string>("");
  const [startTime, setStartTime] = useState<string>("");
  const [endTime, setEndTime] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId) {
      setError("User not found");
      return;
    }

    const token = localStorage.getItem("token");
    try {
      const response = await axios.post(
        "http://localhost:4000/shifts",
        { userId, date, startTime, endTime },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setSuccessMessage("Shift submitted successfully!");
      setDate("");
      setStartTime("");
      setEndTime("");
    } catch (error: any) {
      setError(
        error.response?.data?.details ||
          "Failed to submit shift. Please try again."
      );
    }
  };

  return (
    <div>
      <h1>Submit a New Shift</h1>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {successMessage && <p style={{ color: "green" }}>{successMessage}</p>}
      <form onSubmit={handleSubmit}>
        <label>
          Date:
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
        </label>
        <br />
        <label>
          Start Time:
          <input
            type="time"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            required
          />
        </label>
        <br />
        <label>
          End Time:
          <input
            type="time"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
            required
          />
        </label>
        <br />
        <button type="submit">Submit Shift</button>
      </form>
    </div>
  );
}
