import React, { useEffect, useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import axios from "axios";
import LocationSearchPanel from "../components/User/LocationSearchPanel.jsx"
import { SocketContext } from "../context/SocketContext";
import { useContext } from "react";
import { UserDataContext } from "../context/UserContext";
import { useNavigate } from "react-router-dom";
import LiveTracking from "../components/LiveTracking";
import { FareDataContext } from "../context/FareContext";

function Home() {
  const [panelOpen, setPanelOpen] = useState(false);
  const panelRef = useRef(null);
  const panelCloseRef = useRef(null);
  const [pickupSuggestions, setPickupSuggestions] = useState([]);
  const [destinationSuggestions, setDestinationSuggestions] = useState([]);
  const [activeField, setActiveField] = useState(null);

  const navigate = useNavigate();

  const { socket } = useContext(SocketContext);
  const { user } = useContext(UserDataContext);

  const { setFare, destination, setDestination, pickup, setPickup } =
    useContext(FareDataContext);

  useEffect(() => {
    socket.emit("join", { userType: "user", userId: user._id });
  }, [user]);

  const handlePickupChange = async (e) => {
    setPickup(e.target.value);
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/maps/get-suggestions`,
        {
          withCredentials: true,
          params: { input: e.target.value },
        }
      );
      setPickupSuggestions(response.data);
    } catch (err) {
      // handle error
      console.log(err);
    }
  };

  const handleDestinationChange = async (e) => {
    setDestination(e.target.value);
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/maps/get-suggestions`,
        {
          withCredentials: true,
          params: { input: e.target.value },
        }
      );
      setDestinationSuggestions(response.data);
    } catch (err) {
      // handle error
      console.log(err);
    }
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      await findTrip();
      navigate("/vehicles-available");
    } catch (error) {
      console.log(error);
    }
  };

  useGSAP(
    function () {
      if (panelOpen) {
        gsap.to(panelRef.current, {
          height: "70%",
          padding: 24,
          /* opacity: 1, */
        });
        gsap.to(panelCloseRef.current, {
          opacity: 1,
        });
      } else {
        gsap.to(panelRef.current, {
          height: "0%",
          padding: 0,
        });
        gsap.to(panelCloseRef.current, {
          opacity: 0,
        });
      }
    },
    [panelOpen]
  );

  async function findTrip() {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/rides/get-fare`,
        {
          withCredentials: true,
          params: { pickup, destination },
        }
      );
      console.log(response.data);
      setFare(response.data);
    } catch (error) {
      console.error("Error fetching fare:", error);
      throw error;
    }
  }

  return (
    <div className="h-screen relative overflow-hidden">
      <img
        className="w-16 absolute left-5 top-5"
        src="https://upload.wikimedia.org/wikipedia/commons/c/cc/Uber_logo_2018.png"
        alt=""
      />
      <div className="h-screen w-screen">
         <img
          className="h-full w-full object-cover"
          src="https://miro.medium.com/v2/resize:fit:1400/0*gwMx05pqII5hbfmX.gif"
          alt=""
        />
       {/*  {<LiveTracking />} */}
      </div>
      <div className=" flex flex-col justify-end h-screen absolute top-0 w-full">
        <div className="h-[30%] p-6 bg-white relative">
          <h5
            ref={panelCloseRef}
            onClick={() => {
              setPanelOpen(false);
            }}
            className="absolute opacity-0 right-6 top-6 text-2xl"
          >
            <i className="ri-arrow-down-wide-line"></i>
          </h5>
          <h4 className="text-2xl font-semibold">Find a trip</h4>
          <form
            className="relative py-3"
            onSubmit={(e) => {
              submitHandler(e);
            }}
          >
            {!panelOpen && (
              <div className="line absolute h-16 w-1 top-[50%] -translate-y-1/2 left-5 bg-gray-700 rounded-full"></div>
            )}
            <input
              onClick={() => {
                setPanelOpen(true);
                setActiveField("pickup");
              }}
              value={pickup}
              onChange={handlePickupChange}
              className="bg-[#eee] px-12 py-2 text-lg rounded-lg w-full"
              type="text"
              placeholder="Add a pick-up location"
            />
            <input
              onClick={() => {
                setPanelOpen(true);
                setActiveField("destination");
              }}
              value={destination}
              onChange={handleDestinationChange}
              className="bg-[#eee] px-12 py-2 text-lg rounded-lg w-full  mt-3"
              type="text"
              placeholder="Enter your destination"
            />
            {panelOpen && (
              <button
                type="submit"
                className="bg-black text-white px-4 py-2 rounded-lg mt-3 w-full"
              >
                Find Trip
              </button>
            )}
          </form>
        </div>
        <div ref={panelRef} className="bg-white h-0 ">
          {
            <LocationSearchPanel
              suggestions={
                activeField === "pickup"
                  ? pickupSuggestions
                  : destinationSuggestions
              }
              setPickup={setPickup}
              setDestination={setDestination}
              activeField={activeField}
            />
          }
        </div>
      </div>
    </div>
  );
}

export default Home;
