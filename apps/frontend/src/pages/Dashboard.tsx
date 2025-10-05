import { useEffect, useState } from "react";
import api from "../lib/api";

export default function Dashboard() {
  const [users, setUsers] = useState<Array<{ id: string; name: string }>>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    api
      .get<{ id: string; name: string }[]>("/users")
      .then((data) => {
        if (mounted) setUsers(data || []);
      })
      .catch((e) => {
        console.error(e);
      })
      .finally(() => mounted && setLoading(false));
    return () => {
      mounted = false;
    };
  }, []);

  if (loading) return <div>Loading dashboard...</div>;

  return (
    <div style={{ maxWidth: 800, margin: "1rem auto" }}>
      <h2>Dashboard</h2>
      <h3>Users</h3>
      <ul>
        {users.map((u) => (
          <li key={u.id}>
            {u.name} — {u.id}
          </li>
        ))}
      </ul>
    </div>
  );
}
