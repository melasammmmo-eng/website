import { useEffect, useState } from "react";
import "../styles/globals.css";

const API = "https://jackbotv2-production.up.railway.app/api";

export default function Home() {
  const [status, setStatus] = useState("loading");
  const [commands, setCommands] = useState([]);
  const [members, setMembers] = useState([]);
  const [selected, setSelected] = useState("");
  const [dev, setDev] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    load();
  }, []);

  async function load() {
    try {
      const s = await fetch(API + "/status");
      const stat = await s.json();
      setStatus(stat.status);

      const c = await fetch(API + "/commands");
      setCommands(await c.json());

      const m = await fetch(API + "/members");
      setMembers(await m.json());
    } catch {
      setStatus("offline");
    }
  }

  function login(pass) {
    if (pass === "forjack43") {
      setDev(true);
      setError("");
    } else {
      setError("Wrong password");
    }
  }

  async function timeout() {
    await fetch(API + "/timeout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user_id: selected })
    });
  }

  return (
    <div className="container">

      {/* STATUS */}
      <div className="card">
        <div className="title">Bot Status</div>
        <div className="status">
          <div className={`dot ${status === "online" ? "green" : "red"}`}></div>
          {status}
        </div>
      </div>

      {/* COMMANDS */}
      <div className="card">
        <div className="title">Commands</div>
        {commands.map(cmd => (
          <div key={cmd}>/{cmd}</div>
        ))}
      </div>

      {/* DEV MODE */}
      <div className="card">
        <div className="title">Developer Mode</div>

        {!dev ? (
          <>
            <input id="pass" placeholder="Enter password" />
            <button onClick={() => login(document.getElementById("pass").value)}>
              Unlock
            </button>
            <div style={{color:"red"}}>{error}</div>
          </>
        ) : (
          <>
            <select onChange={(e) => setSelected(e.target.value)}>
              <option>Select Member</option>
              {members.map(m => (
                <option key={m.id} value={m.id}>{m.name}</option>
              ))}
            </select>

            <button onClick={timeout}>Timeout User</button>
          </>
        )}
      </div>

    </div>
  );
}
