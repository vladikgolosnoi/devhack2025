import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function RegisterForm() {
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    login: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Register Submitted", form);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        type="text"
        name="fullName"
        placeholder="ФИО"
        onChange={handleChange}
        required
      />
      <Input
        type="email"
        name="email"
        placeholder="Email"
        onChange={handleChange}
        required
      />
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
      <Input
        type="password"
        name="confirmPassword"
        placeholder="Повторите пароль"
        required
      />
      <Button type="submit" className="w-full">
        Зарегистрироваться
      </Button>
    </form>
  );
}
