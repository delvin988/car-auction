import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

function EditItem() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [editInput, setEditInput] = useState({
    name: "",
    description: "",
    price: "",
    imageUrl: "",
  });

  useEffect(() => {
    async function fetchItemById() {
      try {
        const response = await axios({
          method: "GET",
          url: `http://localhost:3000/items/${id}`,
          headers: {
            Authorization: "Bearer " + localStorage.getItem("access_token"),
          },
        });
        const { name, description, price, imageUrl } = response.data;
        setEditInput({ name, description, price, imageUrl });
      } catch (error) {
        console.log(error);
      }
    }
    fetchItemById();
  }, [id]);

  function handleInputDataForm(event) {
    const { name, value } = event.target;
    setEditInput({
      ...editInput,
      [name]: value,
    });
  }

  async function editData(event) {
    event.preventDefault();

    try {
      const response = await axios({
        method: "PUT",
        url: `http://localhost:3000/items/${id}`,
        data: editInput,
        headers: {
          Authorization: "Bearer " + localStorage.getItem("access_token"),
        },
      });

      console.log(response.data);
      navigate("/");
    } catch (error) {
      console.log(error.response.data);
    }
  }

  return (
    <form onSubmit={editData} className="max-w-md mx-auto">
      <div className="mb-4">
        <label htmlFor="name" className="block text-gray-700 font-bold mb-2">
          Name
        </label>
        <input
          type="text"
          id="name"
          name="name"
          value={editInput.name}
          onChange={handleInputDataForm}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          placeholder="Name"
          required
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
          value={editInput.description}
          onChange={handleInputDataForm}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline h-32 resize-none"
          placeholder="Description"
          required
        />
      </div>
      <div className="mb-4">
        <label htmlFor="price" className="block text-gray-700 font-bold mb-2">
          Price
        </label>
        <input
          type="number"
          id="price"
          name="price"
          value={editInput.price}
          onChange={handleInputDataForm}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          placeholder="Price"
          required
        />
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
          value={editInput.imageUrl}
          onChange={handleInputDataForm}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          placeholder="Image URL"
          required
        />
      </div>
      <div className="flex items-center justify-between">
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          Save Changes
        </button>
        <button
          onClick={() => navigate("/")}
          className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}

export default EditItem;
