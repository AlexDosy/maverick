import { useState } from "react";
import { useRouter } from "next/router";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function login() {
    setError("");

    const res = await fetch(
      "https://miniature-space-guacamole-qgvv96gqpph4j57-3000.app.github.dev/auth/login",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      },
    );

    if (!res.ok) {
      setError("Login failed");
      return;
    }

    const data = await res.json();
    localStorage.setItem("token", data.accessToken);
    router.push("/admin");
  }

  return (
    <div style={{ padding: 40 }}>
      <h1>Login</h1>

      <input
        placeholder="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <br />

      <input
        placeholder="password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <br />

      <button onClick={login}>Login</button>

      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
}
