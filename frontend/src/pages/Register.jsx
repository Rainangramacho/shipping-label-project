import { useState, useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../auth/AuthContext";
import "../styles/AuthForm.css";

export default function Register() {
  const { register } = useContext(AuthContext);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  function handleChange(e) {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      await register(form);
      window.location.href = "/dashboard";
    } catch (err) {
      alert("Registration failed. Please try again.");
    }
  }

  return (
    <div className="login-page">
      <div className="login-card login-card--register">
        <header>
          <h2>Register</h2>
          <p className="login-lede">
            Create your account to manage shipments.
          </p>
        </header>

        <form onSubmit={handleSubmit}>
          <div className="login-field">
            <label htmlFor="register-name">Name</label>
            <input
              id="register-name"
              name="name"
              type="text"
              autoComplete="name"
              placeholder="Jane Doe"
              value={form.name}
              onChange={handleChange}
            />
          </div>

          <div className="login-field">
            <label htmlFor="register-email">Email</label>
            <input
              id="register-email"
              name="email"
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={handleChange}
            />
          </div>

          <div className="login-field">
            <label htmlFor="register-password">Password</label>
            <input
              id="register-password"
              name="password"
              type="password"
              autoComplete="new-password"
              placeholder="Choose a password"
              value={form.password}
              onChange={handleChange}
            />
          </div>

          <div className="login-form-actions">
            <button className="login-submit" type="submit">
              Create account
            </button>
          </div>
        </form>

        <p className="login-footer">
          Already have an account? <Link to="/">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
