import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function Home() {
  const navigate = useNavigate();

  const [itemData, setItemData] = useState([]);

  async function fetchData() {
    try {
      const { data } = await axios({
        method: "GET",
        url: "http://localhost:3000/pub/items",
        headers: {
          Authorization: "Bearer " + localStorage.getItem("access_token"),
        },
      });

      setItemData(data);
    } catch (error) {
      console.log(error.data);
    }
  }

  useEffect(() => {
    fetchData();
  }, []);

  function handleButtomBid(id) {
    navigate(`/bid/${id}`);
  }

  return (
    <>
      <div className="h-screen relative">
        <div className="absolute inset-0">
          <img className="w-full h-full object-cover" src="/250.jpeg" alt="" />
        </div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="container text-center">
            <h1 className="text-7xl text-white font-extralight font-contrail-one">
              Welcome to Auto Bid
            </h1>
            <p className="text-white font-extralight font-contrail-one">
              Where you can find the best car
            </p>
          </div>
        </div>
      </div>
      <div className="container mx-auto mt-20 mb-20 flex justify-center">
        {itemData.map((item, index) => (
          <div
            key={index}
            className="max-w-md rounded overflow-hidden shadow-lg mx-4"
          >
            <img className="w-full" src={item.imageUrl} alt={item.name} />
            <div className="px-6 py-4">
              <div className="font-bold text-xl mb-2">{item.name}</div>
              <p className="text-gray-700 text-base">{item.description}</p>
              <p className="text-gray-700 text-base">{item.price}</p>
            </div>
            <div className="px-6 py-4">
              <button
                onClick={() => {
                  handleButtomBid(item.id);
                }}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full"
              >
                Start Bid
              </button>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
