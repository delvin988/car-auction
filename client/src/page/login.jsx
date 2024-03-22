/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-undef */
import { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

export default function LoginPage() {
  const navigate = useNavigate();
  const [loginInput, setLoginInput] = useState({
    email: "",
    password: "",
  });

  function handleInputLoginForm(event) {
    const { name, value } = event.target;
    setLoginInput({
      ...loginInput,
      [name]: value,
    });
  }

  const handleCredentialResponse = async (response) => {
    try {
      const { data } = await axios({
        method: "post",
        url: "http://localhost:3000/google-login",
        headers: {
          "google-token": response.credential,
        },
      });
      localStorage.setItem("access_token", data.access_token);
      navigate("/");
      console.log(data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    google.accounts.id.initialize({
      client_id:
        "933231867226-9efkmdhmftmj109ms1qmodtjct3id4ml.apps.googleusercontent.com",
      callback: handleCredentialResponse,
    });
    google.accounts.id.renderButton(document.getElementById("google-button"), {
      theme: "outline",
      size: "large",
    });
  }, []);

  async function handleSubmitLogin(event) {
    event.preventDefault();
    try {
      const response = await axios({
        method: "POST",
        url: "http://localhost:3000/login",
        data: loginInput,
      });
      console.log(response);
      const { id, access_token } = response.data;
      localStorage.setItem("user_id", id);
      localStorage.setItem("access_token", access_token);
      console.log(response.data);
      navigate("/");
    } catch (error) {
      console.error("Error updating job:", error);
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        const errorMessage = error.response.data.message;
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: errorMessage,
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Failed to Login!",
        });
      }
    }
  }
  return (
    <>
      <div className="absolute top-0 left-0 w-full h-full bg-gray-900 overflow-hidden">
        <div className="container h-screen mx-auto">
          <div className="grid grid-cols-10 h-screen place-items-center">
            <div className="col-start-2 col-span-8 sm:col-start-2 sm:col-span-8 place-items-center">
              <div className="grid grid-cols-10">
                <div className="col-start-2 col-span-8">
                  <div className="card px-10 py-5 sm:px-20 sm:py-10 rounded-md">
                    <h2 className="text-4xl tracking-widest text-white text-opacity-70 text-center uppercase mb-14">
                      <span className="text-white text-opacity-100 text-6xl font-bold">
                        Auto Bid
                      </span>
                    </h2>
                    <form
                      className="mt-6 mb-6 space-y-6"
                      onSubmit={handleSubmitLogin}
                    >
                      <div className="mb-5">
                        <label htmlFor="email-address" className="sr-only">
                          Email address
                        </label>
                        <input
                          id="email-address"
                          name="email"
                          type="email"
                          onChange={handleInputLoginForm}
                          autoComplete="off"
                          required
                          className="block w-full px-3 py-2 border rounded-sm text-purple-900 focus:outline-none focus:ring focus:ring-purple-500 focus:border-purple-500 focus:z-10 sm:text-lg tracking-wider"
                          placeholder="Email address"
                        />
                      </div>
                      <div>
                        <label htmlFor="password" className="sr-only">
                          Password
                        </label>
                        <input
                          id="password"
                          name="password"
                          type="password"
                          onChange={handleInputLoginForm}
                          autoComplete="off"
                          required
                          className="block w-full px-3 py-2 border rounded-sm text-purple-900 focus:outline-none focus:ring focus:ring-purple-500 focus:border-purple-500 focus:z-10 sm:text-lg tracking-wider"
                          placeholder="Password"
                        />
                      </div>
                      <div className="flex justify-center">
                        <button
                          type="submit"
                          className="w-full flex justify-center py-2 px-4 border border-transparent text-sm rounded-sm text-purple-900 bg-white bg-opacity-90 hover:bg-white hover:bg-opacity-80 focus:outline-none focus:ring focus:border-purple-500 focus:ring-purple-500 text-lg tracking-wider flex font-bold"
                        >
                          Log In
                        </button>
                      </div>
                      <div className="flex justify-center mb-4">
                        <div id="google-button"></div>
                      </div>
                      <div className="text-center">
                        <p className="text-white text-sm">
                          <span className="mr-1">
                            Does not have an account?
                          </span>
                          <Link
                            to="/register"
                            className="inline-block text-yellowGreen-600 hover:text-yellowGreen-500 font-semibold"
                          >
                            Register
                          </Link>
                        </p>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
