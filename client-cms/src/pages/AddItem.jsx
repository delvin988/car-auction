import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

function AddItem() {
  const navigate = useNavigate();

  const [dataInput, setDataInput] = useState({
    name: "",
    description: "",
    price: "",
    imageUrl: "",
  });

  function handleInputDataForm(event) {
    const { name, value } = event.target;
    setDataInput({
      ...dataInput,
      [name]: value,
    });
  }

  async function addData(event) {
    event.preventDefault();

    try {
      const response = await axios({
        method: "POST",
        url: "http://localhost:3000/items",
        data: dataInput,
        headers: {
          Authorization: "Bearer " + localStorage.getItem("access_token"),
        },
      });

      navigate("/");
      Swal.fire({
        icon: "success",
        title: "Item Added",
        text: "New Item has been successfully added!",
      });
    } catch (error) {
      console.log(error.response.data);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to add item. Please try again.",
      });
    }
  }

  return (
    <>
      <div className="container mx-auto py-6">
        <form onSubmit={addData} className="max-w-lg mx-auto">
          <div className="mb-4">
            <label
              htmlFor="name"
              className="block text-gray-700 font-bold mb-2"
            >
              Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={dataInput.name}
              onChange={handleInputDataForm}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="description"
              className="block text-gray-700 font-bold mb-2"
            >
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={dataInput.description}
              onChange={handleInputDataForm}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            ></textarea>
          </div>
          <div className="mb-4">
            <label
              htmlFor="imageUrl"
              className="block text-gray-700 font-bold mb-2"
            >
              Image URL
            </label>
            <input
              type="text"
              id="imageUrl"
              name="imageUrl"
              value={dataInput.imageUrl}
              onChange={handleInputDataForm}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="price"
              className="block text-gray-700 font-bold mb-2"
            >
              Price
            </label>
            <input
              type="number"
              id="price"
              name="price"
              value={dataInput.price}
              onChange={handleInputDataForm}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
          <div className="flex items-center justify-between">
            <button
              type="submit"
              className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </>
  );
}

export default AddItem;
