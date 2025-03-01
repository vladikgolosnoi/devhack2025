import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function LoginForm() {
  const [form, setForm] = useState({ login: "", password: "" });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Login Submitted", form);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        type="text"
        name="login"
        placeholder="Логин"
        onChange={handleChange}
        required
      />
      <Input
        type="password"
        name="password"
        placeholder="Пароль"
        onChange={handleChange}
        required
      />
      <Button type="submit" className="w-full">
        Войти
      </Button>
    </form>
  );
}
