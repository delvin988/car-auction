import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import axios from "axios";

export default function MyBid() {
  const [myBidData, setMyBidData] = useState([]);
  
  const handleCheckout = async (bidItemId) => {
    try {
      const { data } = await axios.get(`http://localhost:3000/pub/payment/midtrans/initiate/${bidItemId}`, {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("access_token"),
        }
      });
      window.snap.pay(data.transactionToken, {
        onSuccess: async function (result) {
          alert("Payment success!");
          console.log(result);
          await axios.patch(
            `http://localhost:3000/pub/users/me/upgrade/${bidItemId}`,
            { OrderId: data.OrderId },
            { headers: { Authorization: "Bearer " + localStorage.getItem("access_token") } }
          );
        },
      });
    } catch (error) {
      console.error("Error initiating payment:", error);
    }
  };

  async function fethData() {
    const token = localStorage.getItem("access_token");

    if (token) {
      const decodedToken = jwtDecode(token);
      console.log(decodedToken);
      const userId = decodedToken.id;
      try {
        const { data } = await axios({
          method: "GET",
          url: `http://localhost:3000/pub/items/bid/${userId}`,
          headers: {
            Authorization: "Bearer " + localStorage.getItem("access_token"),
          },
        });
        console.log(data);
        setMyBidData(data);
      } catch (error) {
        console.log(error);
      }
    }
  }

  useEffect(() => {
    fethData();
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
      {myBidData.map((bidItem) => (
        <div
          key={bidItem.id}
          className="border border-gray-200 shadow-lg rounded-lg overflow-hidden"
        >
          <img
            src={bidItem.Item.imageUrl}
            alt={bidItem.Item.name}
            className="w-full h-48 object-cover object-center"
          />
          <div className="p-4">
            <h2 className="text-lg font-semibold">{bidItem.Item.name}</h2>
            <p className="text-gray-600">{bidItem.Item.description}</p>
            <p className="text-gray-800 font-bold">
              Initial Price: ${bidItem.Item.price}
            </p>
            <p className="text-red-500 font-bold">
              Bid Amount: ${bidItem.amount}
            </p>
            <button className="mt-4 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition duration-200" onClick={() => handleCheckout(bidItem.id)}>
              Pay
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
