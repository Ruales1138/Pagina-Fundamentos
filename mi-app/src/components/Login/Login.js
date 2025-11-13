import React, { useState } from "react";
import style from "./Login.module.css";
import logo from "../../images/logo_udem.png";
import logo_app_2 from "../../images/logo_app_2.png";
import { useNavigate } from "react-router-dom";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("Estudiante");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("http://localhost:3001/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password, role }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Error en el inicio de sesión");
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      if (data.user.role === "Estudiante") navigate("/student");
      else if (data.user.role === "Docente") navigate("/teacher");
      else navigate("/");
    } catch (err) {
      console.error(err);
      const userMessage =
        err.message && err.message.includes("Failed to fetch")
          ? "No se pudo conectar con el servidor. Verifica tu conexión e inténtalo de nuevo."
          : err.message || "Error al iniciar sesión. Inténtalo de nuevo.";
      setError(userMessage);
      setLoading(false);
    }
  };

  return (
    <div className={style.container}>
      <div className={style.card}>
        <img src={logo} alt="Universidad de Medellín" className={style.logo} />
        <img src={logo_app_2} alt="Logo" className={style.logoApp} />

        <h2 className={style.title}>ApoyaTuIngenio</h2>
        <h3 className={style.subtitle}>Iniciar Sesión</h3>

        <form onSubmit={handleSubmit} className={style.form}>
          <div className={style.formGroup}>
            <label>Usuario</label>
            <input
              className={style.input}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              type="text"
              placeholder="Ingrese su nombre de usuario"
              required
            />
          </div>

          <div className={style.formGroup}>
            <label>Contraseña</label>
            <input
              className={style.input}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              placeholder="Ingrese su contraseña"
              required
            />
          </div>

          <div className={style.formGroup}>
            <label>Rol</label>
            <select
              className={style.select}
              value={role}
              onChange={(e) => setRole(e.target.value)}
            >
              <option>Estudiante</option>
              <option>Docente</option>
            </select>
          </div>

          {error && <div className={style.error}>{error}</div>}

          <button type="submit" className={style.button} disabled={loading}>
            {loading ? "Ingresando..." : "Ingresar"}
          </button>
        </form>

        <div className={style.footer}>
          <a href="#" onClick={(e) => { e.preventDefault(); navigate("/forgot-password"); }}>¿Olvidó su contraseña?</a>
          <a href="#" onClick={(e) => { e.preventDefault(); navigate("/register"); }}>Crear cuenta</a>
        </div>
      </div>
    </div>
  );
}

export default Login;
