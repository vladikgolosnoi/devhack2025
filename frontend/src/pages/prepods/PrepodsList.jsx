import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FaCrown } from "react-icons/fa";
import { getUsers } from "../../components/api/users";

export default function AllPrepods() {
  const [teachers, setTeachers] = useState([]);

  useEffect(() => {
    async function fetchTeachers() {
      try {
        const data = await getUsers();
        setTeachers(data || []);
      } catch (error) {
        console.error("Ошибка загрузки преподавателей:", error);
      }
    }
    fetchTeachers();
  }, []);

  const sortedTeachers = teachers.sort((a, b) => b.user.id - a.user.id);

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <motion.h1
          className="mt-12 text-4xl sm:text-5xl font-bold text-center mb-4"
          initial={{ opacity: 0, y: -40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Все преподаватели
        </motion.h1>
        <motion.p
          className="text-center text-sm sm:text-base text-gray-700 mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          Здесь вы можете ознакомиться со всеми преподавателями, узнать об их
          опыте и перейти на их страницы.
        </motion.p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {sortedTeachers.map((teacher) => (
            <motion.div
              key={teacher.user.id}
              className={`relative bg-white/70 backdrop-blur-md rounded-2xl p-6 shadow-xl transform transition-all hover:scale-105 hover:shadow-2xl ${
                teacher.subscription === "premium"
                  ? "border-4 border-yellow-400"
                  : ""
              }`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex flex-col items-center">
                <div className="relative w-24 h-24 mb-4">
                  <img
                    src={teacher.avatar || "/default-avatar.png"}
                    alt="Avatar"
                    className="w-24 h-24 rounded-full object-cover border-4 border-transparent hover:border-indigo-500 transition"
                  />
                  {teacher.subscription === "premium" && (
                    <div className="absolute -bottom-1 -right-1">
                      <FaCrown
                        className="text-yellow-400 text-2xl"
                        title="Премиум"
                      />
                    </div>
                  )}
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-gray-800">
                  {teacher.user.first_name} {teacher.user.last_name}
                </h2>
                <p className="text-sm sm:text-base text-gray-600">
                  @{teacher.user.username}
                </p>
                <p className="mt-2 text-base sm:text-lg text-gray-700">
                  {teacher.profession || "Профессия не указана"}
                </p>
                <Link
                  to={`/profile/${teacher.user.id}`}
                  className="mt-4 inline-block px-4 py-2 bg-indigo-600 text-white rounded-full shadow hover:bg-indigo-700 transition text-base sm:text-lg"
                >
                  Перейти в профиль
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
        <motion.div
          className="mt-12 text-center text-gray-700"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        ></motion.div>
      </div>
    </div>
  );
}
