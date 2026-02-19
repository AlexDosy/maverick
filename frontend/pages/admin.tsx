import { useEffect, useState } from "react";

export default function AdminPage() {
  const [result, setResult] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");

    fetch(
      "https://miniature-space-guacamole-qgvv96gqpph4j57-3000.app.github.dev/learning/admin-check",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    )
      .then((res) => {
        if (!res.ok) throw new Error("Forbidden");
        return res.json();
      })
      .then(() => setResult("ACCESS GRANTED"))
      .catch(() => setResult("ACCESS DENIED"));
  }, []);

  return (
    <div style={{ padding: 40 }}>
      <h1>Admin Check</h1>
      <p>{result}</p>
    </div>
  );
}
