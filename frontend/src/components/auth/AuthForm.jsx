import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import AlertMessage from "@/components/ui/AlertMessage";
import { login, register } from "@/components/api";
import { IoIosArrowBack } from "react-icons/io";

export default function AuthForm() {
  const [form, setForm] = useState({
    lastName: "",
    firstName: "",
    middleName: "",
    email: "",
    login: "",
    password: "",
    confirmPassword: "",
    agreeToS: false,
  });
  const [tab, setTab] = useState("login");
  const [alert, setAlert] = useState(null);
  const navigate = useNavigate();

  const showAlert = (type, message) => {
    setAlert(null);
    setTimeout(() => setAlert({ type, message }), 50);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === "checkbox" ? checked : value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setAlert(null);

    try {
      if (tab === "register") {
        if (!form.agreeToS)
          return showAlert("error", "Вы должны принять условия использования!");
        if (form.password !== form.confirmPassword)
          return showAlert("error", "Пароли не совпадают!");

        const registrationResponse = await register({
          username: form.login,
          email: form.email,
          password: form.password,
          first_name: form.firstName,
          last_name: form.lastName,
          middle_name: form.middleName,
        });

        if (registrationResponse.error)
          throw new Error(registrationResponse.error);

        showAlert("success", "Регистрация успешна! Теперь войдите в аккаунт.");
        setTab("login");
      } else {
        const loginResponse = await login(form.login, form.password);
        if (loginResponse.error) throw new Error(loginResponse.error);

        showAlert("success", "Вы успешно вошли!");
        window.location.reload();
      }
    } catch (error) {
      showAlert("error", "Неверный логин или пароль.");
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (token) {
      navigate("/profile");
    }
  }, [navigate]);

  return (
    <div className="flex justify-center items-center min-h-screen w-full bg-gray-100 text-black px-4 py-8 relative">
      {alert && (
        <AlertMessage
          type={alert.type}
          message={alert.message}
          onClose={() => setAlert(null)}
        />
      )}
      <Card className="w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg shadow-lg p-6 bg-white relative">
        <button
          onClick={() => navigate("/")}
          className="absolute top-4 left-4 p-3 bg-gray-200 rounded-full text-gray-700 hover:bg-gray-300 focus:outline-none transition duration-300 ease-in-out"
        >
          <IoIosArrowBack size={24} />
        </button>
        <CardHeader>
          <CardTitle className="text-center text-xl">
            {tab === "login" ? "Вход" : "Регистрация"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center gap-2 flex-col md:flex-row mb-4">
            <button
              onClick={() => setTab("login")}
              className={`text-sm p-2 rounded-md ${
                tab === "login" ? "font-bold bg-gray-200" : "text-gray-500"
              }`}
            >
              Вход
            </button>
            <button
              onClick={() => setTab("register")}
              className={`text-sm p-2 rounded-md ${
                tab === "register" ? "font-bold bg-gray-200" : "text-gray-500"
              }`}
            >
              Регистрация
            </button>
          </div>

          {/* Вход */}
          {tab === "login" && (
            <motion.form
              onSubmit={handleSubmit}
              className="space-y-3"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Input
                type="text"
                name="login"
                placeholder="Логин"
                onChange={handleChange}
                required
                className="bg-gray-200 text-black"
              />
              <Input
                type="password"
                name="password"
                placeholder="Пароль"
                onChange={handleChange}
                required
                className="bg-gray-200 text-black"
              />
              <Button
                type="submit"
                className="w-full bg-black text-white hover:bg-gray-900"
              >
                Войти
              </Button>
            </motion.form>
          )}

          {/* Регистрация */}
          {tab === "register" && (
            <motion.form
              onSubmit={handleSubmit}
              className="space-y-3"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Input
                type="text"
                name="lastName"
                placeholder="Фамилия"
                onChange={handleChange}
                required
                className="bg-gray-200 text-black"
              />
              <Input
                type="text"
                name="firstName"
                placeholder="Имя"
                onChange={handleChange}
                required
                className="bg-gray-200 text-black"
              />
              <Input
                type="text"
                name="middleName"
                placeholder="Отчество"
                onChange={handleChange}
                className="bg-gray-200 text-black"
              />
              <Input
                type="email"
                name="email"
                placeholder="Email"
                onChange={handleChange}
                required
                className="bg-gray-200 text-black"
              />
              <Input
                type="text"
                name="login"
                placeholder="Логин"
                onChange={handleChange}
                required
                className="bg-gray-200 text-black"
              />
              <Input
                type="password"
                name="password"
                placeholder="Пароль"
                onChange={handleChange}
                required
                className="bg-gray-200 text-black"
              />
              <Input
                type="password"
                name="confirmPassword"
                placeholder="Повторите пароль"
                onChange={handleChange}
                required
                className="bg-gray-200 text-black"
              />

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  name="agreeToS"
                  checked={form.agreeToS}
                  onChange={handleChange}
                  className="w-5 h-5"
                />
                <label className="text-sm text-gray-700">
                  Я соглашаюсь с{" "}
                  <Link to="/terms" className="text-blue-500 underline">
                    условиями использования ПреподавательОнлайн
                  </Link>
                </label>
              </div>

              <Button
                type="submit"
                className="w-full bg-black text-white hover:bg-gray-900"
              >
                Зарегистрироваться
              </Button>
            </motion.form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
