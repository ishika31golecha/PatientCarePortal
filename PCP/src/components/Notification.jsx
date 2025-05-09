import React from "react";

const Notification = ({ alert }) => {
  return (
    <div>
      {alert && (
        <div className="bg-red-500 text-white p-4 rounded-md mt-4 text-center">
          🚨 **Red Light Detected! Please Check!**
        </div>
      )}
    </div>
  );
};

export default Notification;
