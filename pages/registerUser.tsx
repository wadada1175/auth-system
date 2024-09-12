import { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import withAuth from "../hoc/withAuth"; // 管理者認証用HOC

function RegisterUser() {
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
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
            setIsAdmin(true); // 管理者確認後、フォームを表示
          }
        })
        .catch(() => {
          router.push("/login"); // エラー時はログイン画面へ
        });
    } else {
      router.push("/login");
    }
  }, [router]);

  const [staffNumber, setStaffNumber] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [address, setAddress] = useState<string>("");
  const [phoneNumber, setPhoneNumber] = useState<string>("");
  const [dateOfBirth, setDateOfBirth] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [employmentStatus, setEmploymentStatus] = useState<string>("");
  const [employmentStartDate, setEmploymentStartDate] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem("token"); // トークンを取得

    try {
      await axios.post(
        "http://localhost:4000/registerUser",
        {
          staffNumber,
          name,
          address,
          phoneNumber,
          dateOfBirth,
          email,
          password,
          employmentStatus,
          employmentStartDate,
        },
        {
          headers: { Authorization: `Bearer ${token}` }, // トークンをヘッダーに追加
        }
      );

      setSuccessMessage("User registered successfully!");
      setStaffNumber("");
      setName("");
      setAddress("");
      setPhoneNumber("");
      setDateOfBirth("");
      setEmail("");
      setPassword("");
      setEmploymentStatus("");
      setEmploymentStartDate("");
    } catch (error) {
      setError("Failed to register user. Please try again.");
    }
  };

  return (
    <div>
      <h1>Register New User</h1>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {successMessage && <p style={{ color: "green" }}>{successMessage}</p>}
      <form onSubmit={handleSubmit}>
        <label>Staff Number:</label>
        <input
          type="text"
          value={staffNumber}
          onChange={(e) => setStaffNumber(e.target.value)}
          required
        />
        <br />
        <label>Name:</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <br />
        <label>Address:</label>
        <input
          type="text"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          required
        />
        <br />
        <label>Phone Number:</label>
        <input
          type="text"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
          required
        />
        <br />
        <label>Date of Birth:</label>
        <input
          type="date"
          value={dateOfBirth}
          onChange={(e) => setDateOfBirth(e.target.value)}
          required
        />
        <br />
        <label>Email:</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <br />
        <label>Password:</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <br />
        <label>Employment Status:</label>
        <input
          type="text"
          value={employmentStatus}
          onChange={(e) => setEmploymentStatus(e.target.value)}
          required
        />
        <br />
        <label>Employment Start Date:</label>
        <input
          type="date"
          value={employmentStartDate}
          onChange={(e) => setEmploymentStartDate(e.target.value)}
          required
        />
        <br />
        <button type="submit">Register</button>
      </form>
    </div>
  );
}

export default withAuth(RegisterUser); // 管理者のみアクセス可能
