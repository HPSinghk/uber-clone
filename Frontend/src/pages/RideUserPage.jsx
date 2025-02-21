import React, { useRef, useState, useContext, useEffect } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import LookingForDriver from "../components/User/LookingForDriver";
import WaitingForDriver from "../components/User/WaitingForDriver";
import { SocketContext } from "../context/SocketContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function RideUserPage() {
  const navigate = useNavigate();

  const [ride, setRide] = useState(null);
  const [rideStatus, setRideStatus] = useState("pending");
  const [otp, setOtp] = useState(null);
  const [pickup, setPickup] = useState("");
  const [destination, setDestination] = useState("");
  const [fare, setFare] = useState("");
  const [updateRideDetails, setUpdateRideDetails] = useState(0);

  const { socket } = useContext(SocketContext);

  console.log(rideStatus);

  useEffect(() => {
    const fetchRideDetails = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/rides/user/search-ride`,
          {
            withCredentials: true,
          }
        );
        if (response.status === 200) {
          console.log(response.data);
          setRide(response.data);
          setRideStatus(response.data.status);
          setOtp(response.data.otp);
          setFare(response.data.fare);
          setPickup(response.data.pickup);
          setDestination(response.data.destination);
        }
      } catch (err) {
        console.error(err);
      }
    };

    fetchRideDetails();
  }, [updateRideDetails]);

  socket.on("ride-confirmed", (ride) => {
    console.log("your ride has been confirmed");
    setUpdateRideDetails((prev) => prev + 1);
  });

  socket.on("new-ride", (ride) => {
    setUpdateRideDetails((prev) => prev + 1);
  });

  socket.on("ride-started", (ride) => {
    console.log("ride has started");
    console.log("ride");
    navigate("/riding", { state: { ride } }); // Updated navigate to include ride data
  });

  return (
    <div>
      {rideStatus === "pending" && (
        <LookingForDriver
          otp={otp}
          pickup={pickup}
          destination={destination}
          fare={fare}
        />
      )}
      {rideStatus === "accepted" && <WaitingForDriver ride={ride} />}
    </div>
  );
}

export default RideUserPage;
