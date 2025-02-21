import React from "react";

const LookingForDriver = (props) => {
  return (
    <div className="bg-gray-50 min-h-screen flex flex-col items-center p-5 animate-pulse">
      {/* Header Section */}
      <h5 className="p-1 text-center w-[93%] absolute top-0"></h5>
      <h3 className="text-2xl font-semibold mb-5">Looking for a Driver</h3>

      {/* Ride Information */}
      <div className="flex gap-2 justify-between flex-col items-center">
        <img
          className="h-20 rounded-full border-2 border-blue-600"
          src="https://swyft.pl/wp-content/uploads/2023/05/how-many-people-can-a-uberx-take.jpg"
          alt="Looking for Driver"
        />
        <div className="w-full mt-5">
          <div className="flex items-center gap-5 p-3 border-b-2">
            <i className="ri-map-pin-user-fill text-blue-600"></i>
            <div>
              <h3 className="text-lg font-medium">Pickup Location</h3>
              <p className="text-sm -mt-1 text-gray-600">{props.pickup}</p>
            </div>
          </div>
          <div className="flex items-center gap-5 p-3 border-b-2">
            <i className="text-lg ri-map-pin-2-fill text-green-600"></i>
            <div>
              <h3 className="text-lg font-medium">Destination</h3>
              <p className="text-sm -mt-1 text-gray-600">{props.destination}</p>
            </div>
          </div>
          <div className="flex items-center gap-5 p-3">
            <i className="ri-currency-line text-yellow-500"></i>
            <div>
              <h3 className="text-lg font-medium">Fare</h3>
              <p className="text-sm -mt-1 text-gray-600">₹{props.fare}</p>
              <p className="text-sm text-gray-500">Payment Mode: Cash</p>
            </div>
          </div>
        </div>
      </div>

      {/* Animation Section */}
      <div className="mt-10 flex items-center justify-center">
        <div className="loader animate-spin rounded-full h-10 w-10 border-t-4 border-blue-600 border-solid"></div>
        <p className="ml-3 text-lg font-medium text-gray-700">Looking for a driver...</p>
      </div>
    </div>
  );
};

export default LookingForDriver;
