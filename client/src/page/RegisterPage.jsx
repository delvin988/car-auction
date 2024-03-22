import ButtonSubmit from "../components/ButtonSubmit";
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

export default function RegisterPage() {
  const navigate = useNavigate();
  const [input, setInput] = useState({
    email: "",
    password: "",
  });

  function handleInputChange(e) {
    e.preventDefault();
    const { name, value } = e.target;
    setInput({
      ...input,
      [name]: value,
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      const { data } = await axios({
        method: "post",
        url: `http://localhost:3000/google-register`,
        headers: { Authorization: `Bearer ${localStorage.access_token}` },
        data: input,
      });
      navigate(`/`);
    } catch (error) {
      Swal.fire({
        title: "Error!",
        text: error.response.data.message,
        icon: "error",
        confirmButtonText: "Cool",
      });
    }
  }
  return (
    <>
      <div className="col-10 bg-light rounded-end-4">
        <div className="row">
          <h2 className="text-center border-bottom">Register</h2>
        </div>
        <div className="row">
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="emailid" className="form-label">
                Email
              </label>
              <input
                onChange={handleInputChange}
                id="emailid"
                type="text"
                className="form-control"
                name="email"
              />
            </div>
            <div className="mb-3">
              <label htmlFor="passwordid" className="form-label">
                Password
              </label>
              <input
                onChange={handleInputChange}
                id="passwordid"
                type="text"
                className="form-control"
                name="password"
              />
            </div>
            <div className="d-flex justify-content-center">
              <ButtonSubmit message={"Add User"} />
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
