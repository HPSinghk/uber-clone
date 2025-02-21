import React from 'react';

const WaitingForDriver = (props) => {
  return (
    <div className="bg-gray-50 min-h-screen flex flex-col items-center p-5">
      {/* Header Section */}
      <h5
        className="bg-blue-600 text-white py-2 px-4 rounded-full shadow-lg text-center w-[90%] max-w-md mb-6 cursor-pointer flex items-center justify-center"
        /* onClick={() => {
          props.waitingForDriver(false);
        }} */
      >
        Waiting for Driver
        <i className="text-3xl text-white  ml-2"></i>
      </h5>

      {/* Driver Information */}
      <div className="bg-white shadow-lg rounded-lg w-full max-w-md p-5 mb-6">
        <div className="flex items-center">
          <img
            className="h-16 w-16 rounded-full border-2 border-blue-600"
            src="https://swyft.pl/wp-content/uploads/2023/05/how-many-people-can-a-uberx-take.jpg"
            alt="Driver"
          />
          <div className="ml-4 text-left">
            <h2 className="text-lg font-bold capitalize">{props.ride?.captain.fullName.firstName}</h2>
            <h4 className="text-md font-medium text-gray-700">{props.ride?.captain.vehicle.plate}</h4>
            <p className="text-sm text-gray-500">Maruti Suzuki Alto</p>
          </div>
        </div>

        <div className="mt-4 text-center">
          <h1 className="text-2xl font-bold text-blue-600">OTP: {props.ride?.otp}</h1>
          <p className="text-sm text-gray-600 mt-1">Share this OTP with the driver upon arrival</p>
        </div>
      </div>

      {/* Ride Details */}
      <div className="bg-white shadow-lg rounded-lg w-full max-w-md p-5">
        <div className="border-b pb-4 mb-4">
          <div className="flex items-center gap-3">
            <i className="text-xl text-blue-600 ri-map-pin-user-fill"></i>
            <div>
              <h3 className="text-md font-medium">Pickup Location</h3>
              <p className="text-sm text-gray-600">{props.ride?.pickup}</p>
            </div>
          </div>
        </div>

        <div className="border-b pb-4 mb-4">
          <div className="flex items-center gap-3">
            <i className="text-xl text-green-600 ri-map-pin-2-fill"></i>
            <div>
              <h3 className="text-md font-medium">Destination</h3>
              <p className="text-sm text-gray-600">{props.ride?.destination}</p>
            </div>
          </div>
        </div>

        <div>
          <div className="flex items-center gap-3">
            <i className="text-xl text-yellow-500 ri-currency-line"></i>
            <div>
              <h3 className="text-md font-medium">Fare</h3>
              <p className="text-sm text-gray-600">₹{props.ride?.fare}</p>
              <p className="text-sm text-gray-500">Payment Mode: Cash</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WaitingForDriver;
