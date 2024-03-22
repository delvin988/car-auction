/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { io } from "socket.io-client";

const socket = io("http://localhost:3000");

export default function BidPage() {
  const { id } = useParams();

  const [itemBidData, setItemBidData] = useState({});
  const [highestData, setHighestData] = useState([]);
  const [bidInput, setBidInput] = useState({
    amount: "",
    ItemId: id,
    UserId: "",
  });
  const [isAdmin, setIsAdmin] = useState(false);
  const [bidClosed, setBidClosed] = useState(false);

  const fetchItemById = async () => {
    try {
      const response = await axios.get(`http://localhost:3000/pub/items/${id}`);
      const { name, description, imageUrl, price } = response.data;
      setItemBidData({ name, description, imageUrl, price });
    } catch (error) {
      console.error(error.response.data);
    }
  };

  const fetchHighestById = async () => {
    try {
      const response = await axios.get(
        `http://localhost:3000/pub/items/bid/highest/${id}`,
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("access_token"),
          },
        }
      );
      let formattedData = response.data.map(({ amount, User }) => ({
        amount,
        bidderName: `${User.firstname} ${User.lastname}`,
      }));
      setHighestData(formattedData);
      socket.emit("newBid", formattedData[0].amount);
    } catch (error) {
      console.error(error.response.data);
    }
  };

  useEffect(() => {
    fetchItemById();
    fetchHighestById();
    userById();
  }, [id]);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setBidInput({ ...bidInput, [name]: value });
  };

  const handleBidSubmit = async (event) => {
    event.preventDefault();
    try {
      await axios.post(`http://localhost:3000/pub/items/${id}/bid`, bidInput, {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("access_token"),
        },
      });

      await fetchHighestById();
    } catch (error) {
      console.error(error.response.data);
    }
  };

  async function userById() {
    try {
      const userId = localStorage.getItem("user_id");
      const response = await axios.get(
        `http://localhost:3000/pub/user/${userId}`
      );

      console.log("User data:", response.data);

      if (response.data.role === "Admin") {
        setIsAdmin(true);
      } else {
        setIsAdmin(false);
      }
    } catch (error) {
      console.error("Error fetching user data:", error.response.data);
    }
  }

  const handleCloseBid = async () => {
    try {
      await axios.post(
        `http://localhost:3000/closeBid`,
        {},
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("access_token"),
          },
        }
      );
      setBidClosed(true);
    } catch (error) {
      console.error(error.response.data);
    }
  };

  useEffect(() => {
    socket.on("message", (msg) => {
      console.log(msg);
    });

    socket.on("count:Bid", (lastBid) => {
      if (lastBid.length > 0) {
        setHighestData(lastBid);
      }
    });

    socket.on("highestBid", (newCount) => {
      if (newCount !== undefined && newCount !== null) {
        setHighestData([{ amount: newCount }]);
      }
      console.log(newCount);
    });

    socket.on("bidClosed", (isClosed) => {
      setBidClosed(isClosed);
    });

    return () => {
      socket.off("message");
      socket.off("highestBid");
      socket.off("bidClosed");
    };
  }, []);

  return (
    <section className="pt-8 py-12 md:py-24">
      <div className="container mx-auto px-4">
        <div className="flex flex-wrap -m-5">
          <div className="w-full md:w-1/2 p-5">
            <div
              className="overflow-hidden rounded-2xl"
              style={{ height: "688px" }}
            >
              <img
                className="w-full h-full object-cover"
                src={itemBidData.imageUrl}
                alt={itemBidData.name}
              />
            </div>
          </div>
          <div className="w-full md:w-1/2 p-5">
            <div className="flex flex-col justify-center h-full">
              <div>
                <h6 className="mb-10 text-5xl font-medium tracking-tight font-heading">
                  {itemBidData.name}
                </h6>
                <p className="mb-6 text-xl text-neutral-700 font-medium max-w-xl">
                  {itemBidData.description}
                </p>
                <p className="mb-6 text-xl text-neutral-700 font-medium max-w-xl">
                  Starting Price: {itemBidData.price}
                </p>
                {/* Highest Bid Display */}
                <div className="mb-6">
                  <h2 className="text-2xl font-semibold">Highest Bid</h2>
                  <p className="text-lg">
                    {highestData.length > 0
                      ? `$${highestData[0].amount}`
                      : "No bids yet"}
                  </p>
                </div>
              </div>
              {/* Bid submission form */}
              {!bidClosed ? (
                <div className="mt-10">
                  <form
                    onSubmit={handleBidSubmit}
                    className="flex flex-col gap-4"
                  >
                    <label className="block">
                      <span className="text-gray-700">Your Bid</span>
                      <input
                        type="number"
                        name="amount"
                        value={bidInput.amount}
                        onChange={handleInputChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                        placeholder="Enter your bid"
                      />
                    </label>
                    <button
                      type="submit"
                      className="px-6 py-2 border rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                    >
                      Place Bid
                    </button>
                  </form>
                </div>
              ) : (
                <p>BID CLOSED!</p>
              )}
              {isAdmin && (
                <div className="mt-4">
                  <button
                    onClick={handleCloseBid}
                    className="px-6 py-2 border rounded-md text-white bg-red-600 hover:bg-red-700"
                  >
                    Close Bid
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
