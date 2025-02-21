import React, { useContext, useRef, useState } from "react";
import ConfirmRide from "./ConfirmRide";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { FareDataContext } from "../../context/FareContext";

const VehiclePanel = (props) => {
  const [confirmRidePanel, setConfirmRidePanel] = useState(false);
  const confirmRidePanelRef = useRef(null);

  const { fare, setVehicleType } = useContext(FareDataContext);

  useGSAP(
    function () {
      if (confirmRidePanel) {
        gsap.to(confirmRidePanelRef.current, {
          transform: "translateY(0)",
        });
      } else {
        gsap.to(confirmRidePanelRef.current, {
          transform: "translateY(100%)",
        });
      }
    },
    [confirmRidePanel]
  );

  return (
    <div className="min-h-screen flex flex-col items-center bg-gray-50 px-4 py-6">
      {/* Page Header */}
      <header className="w-full flex justify-center items-center py-4 mb-6 bg-white shadow-md">
        <h1 className="text-xl font-bold">Ride Options</h1>
      </header>

      {/* Content */}
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-6">
        <h3 className="text-2xl font-semibold mb-5 text-center">Choose a Vehicle</h3>
        <div className="space-y-4">
          {/* UberGo Card */}
          <div
            onClick={() => {
              setConfirmRidePanel(true);
              setVehicleType("car");
            }}
            className="flex border-2 border-gray-300 hover:border-blue-500 transition duration-300 rounded-xl w-full p-4 items-center justify-between shadow-md bg-white cursor-pointer"
          >
            <img
              className="h-12 w-12 object-cover rounded-full"
              src="https://swyft.pl/wp-content/uploads/2023/05/how-many-people-can-a-uberx-take.jpg"
              alt="UberGo"
            />
            <div className="ml-4 w-2/3">
              <h4 className="font-medium text-base flex items-center">
                UberGo{" "}
                <span className="ml-2 text-gray-500 text-sm flex items-center">
                  <i className="ri-user-3-fill mr-1"></i>4
                </span>
              </h4>
              <h5 className="font-medium text-sm text-green-600">2 mins away</h5>
              <p className="font-normal text-sm text-gray-600 mt-1">
                Affordable, compact rides
              </p>
            </div>
            <h2 className="text-lg font-semibold text-gray-800">₹{fare?.car}</h2>
          </div>

          {/* Moto Card */}
          <div
            onClick={() => {
              setConfirmRidePanel(true);
              setVehicleType("moto");
            }}
            className="flex border-2 border-gray-300 hover:border-blue-500 transition duration-300 rounded-xl w-full p-4 items-center justify-between shadow-md bg-white cursor-pointer"
          >
            <img
              className="h-12 w-12 object-cover rounded-full"
              src="https://www.uber-assets.com/image/upload/f_auto,q_auto:eco,c_fill,h_638,w_956/v1649231091/assets/2c/7fa194-c954-49b2-9c6d-a3b8601370f5/original/Uber_Moto_Orange_312x208_pixels_Mobile.png"
              alt="Moto"
            />
            <div className="ml-4 w-2/3">
              <h4 className="font-medium text-base flex items-center">
                Moto{" "}
                <span className="ml-2 text-gray-500 text-sm flex items-center">
                  <i className="ri-user-3-fill mr-1"></i>1
                </span>
              </h4>
              <h5 className="font-medium text-sm text-green-600">3 mins away</h5>
              <p className="font-normal text-sm text-gray-600 mt-1">
                Affordable motorcycle rides
              </p>
            </div>
            <h2 className="text-lg font-semibold text-gray-800">₹{fare?.moto}</h2>
          </div>

          {/* UberAuto Card */}
          <div
            onClick={() => {
              setConfirmRidePanel(true);
              setVehicleType("auto");
            }}
            className="flex border-2 border-gray-300 hover:border-blue-500 transition duration-300 rounded-xl w-full p-4 items-center justify-between shadow-md bg-white cursor-pointer"
          >
            <img
              className="h-12 w-12 object-cover rounded-full"
              src="https://www.uber-assets.com/image/upload/f_auto,q_auto:eco,c_fill,h_368,w_552/v1648431773/assets/1d/db8c56-0204-4ce4-81ce-56a11a07fe98/original/Uber_Auto_558x372_pixels_Desktop.png"
              alt="UberAuto"
            />
            <div className="ml-4 w-2/3">
              <h4 className="font-medium text-base flex items-center">
                UberAuto{" "}
                <span className="ml-2 text-gray-500 text-sm flex items-center">
                  <i className="ri-user-3-fill mr-1"></i>3
                </span>
              </h4>
              <h5 className="font-medium text-sm text-green-600">3 mins away</h5>
              <p className="font-normal text-sm text-gray-600 mt-1">
                Affordable Auto rides
              </p>
            </div>
            <h2 className="text-lg font-semibold text-gray-800">₹{fare?.auto}</h2>
          </div>
        </div>
      </div>

      {/* Confirm Ride Panel */}
      <div
        ref={confirmRidePanelRef}
        className="fixed w-full z-10 bottom-0 translate-y-full bg-white px-3 py-6 pt-12"
      >
        <ConfirmRide setConfirmRidePanel={setConfirmRidePanel} />
      </div>
    </div>
  );
};

export default VehiclePanel;
