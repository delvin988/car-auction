import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

function Register() {
  const navigate = useNavigate();
  const [registerData, setRegisterData] = useState({
    firstname: "",
    lastname: "",
    email: "",
    password: "",
  });

  function handleRegisterInputForm(event) {
    const { name, value } = event.target;
    setRegisterData({
      ...registerData,
      [name]: value,
    });
  }

  async function addUser(event) {
    event.preventDefault();

    try {
      const response = await axios({
        method: "POST",
        url: "http://localhost:3000/register",
        data: registerData,
      });

      console.log(response.data);
      navigate("/login");
    } catch (error) {
      console.log(error.response.data);
    }
  }

  return (
    <section className="absolute top-0 left-0 w-full h-full py-12 md:py-24 bg-gray-900 overflow-hidden">
      <img
        className="absolute bottom-150 left-0 w-full xl:-mb-24 h-1/4 object-contain"
        src="logo.png"
        alt=""
      />
      <div className="relative container px-4 mx-auto">
        <div>
          <div className="text-center">
            <a className="inline-block mx-auto mb-8">
              <img className="h-8" src="" alt="" />
            </a>
          </div>
          <div className="max-w-md p-8 mb-8 mx-auto bg-gray-900 border border-gray-700 rounded-2xl shadow-lg">
            <h3 className="font-heading tracking-tight text-4xl font-bold text-white mb-4">
              Register
            </h3>
            <p className="text-white mb-8">
              Create your account. Please enter your details.
            </p>
            <form onSubmit={addUser}>
              <div className="mb-4">
                <label
                  className="block mb-2 text-sm font-medium text-white"
                  htmlFor="firstname"
                >
                  First Name
                </label>
                <input
                  className="py-2 px-4 h-11 w-full placeholder-gray-500 bg-gray-900 border border-gray-700 focus:border-teal-800 shadow-sm outline-none ring ring-transparent focus:ring-teal-800 rounded-lg text-white"
                  type="text"
                  id="firstname"
                  placeholder="Enter your first name"
                  name="firstname"
                  onChange={handleRegisterInputForm}
                />
              </div>
              <div className="mb-4">
                <label
                  className="block mb-2 text-sm font-medium text-white"
                  htmlFor="lastname"
                >
                  Last Name
                </label>
                <input
                  className="py-2 px-4 h-11 w-full placeholder-gray-500 bg-gray-900 border border-gray-700 focus:border-teal-800 shadow-sm outline-none ring ring-transparent focus:ring-teal-800 rounded-lg text-white"
                  type="text"
                  id="lastname"
                  placeholder="Enter your last name"
                  name="lastname"
                  onChange={handleRegisterInputForm}
                />
              </div>
              <div className="mb-4">
                <label
                  className="block mb-2 text-sm font-medium text-white"
                  htmlFor="email"
                >
                  Email
                </label>
                <input
                  className="py-2 px-4 h-11 w-full placeholder-gray-500 bg-gray-900 border border-gray-700 focus:border-teal-800 shadow-sm outline-none ring ring-transparent focus:ring-teal-800 rounded-lg text-white"
                  type="email"
                  id="email"
                  name="email"
                  placeholder="Enter your email address"
                  onChange={handleRegisterInputForm}
                />
              </div>
              <div className="mb-4">
                <label
                  className="block mb-2 text-sm font-medium text-white"
                  htmlFor="password"
                >
                  Password
                </label>
                <input
                  className="py-2 px-4 h-11 w-full placeholder-gray-500 bg-gray-900 border border-gray-700 focus:border-teal-800 shadow-sm outline-none ring ring-transparent focus:ring-teal-800 rounded-lg text-white"
                  type="password"
                  id="password"
                  placeholder="Enter password"
                  name="password"
                  onChange={handleRegisterInputForm}
                />
              </div>
              <div className="text-right mb-8"></div>
              <button
                className="xs:flex-shrink-0 group relative w-full h-12 flex items-center justify-center px-4 p-px font-bold text-white bg-yellowGreen-600 rounded-lg transition-all duration-300 focus:outline-none"
                type="submit"
              >
                <div className="absolute top-0 left-0 w-full h-full rounded-lg ring ring-yellowGreen-900 animate-pulse group-hover:ring-0 transition duration-300"></div>
                <span>Register</span>
              </button>
            </form>
          </div>
          <div className="text-center">
            <p className="text-white text-sm">
              <span className="mr-1">Already have an account?</span>
              <Link
                to="/login"
                className="inline-block text-yellowGreen-600 hover:text-yellowGreen-500 font-semibold"
              >
                Login
              </Link>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Register;
