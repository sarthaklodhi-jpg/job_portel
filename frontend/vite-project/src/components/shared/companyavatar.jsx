import React from "react";

const getInitials = (name = "") => {
  if (!name || typeof name !== "string") return "CN";

  const words = name.trim().split(" ").filter(Boolean);

  if (words.length === 1) {
    return words[0].charAt(0).toUpperCase();
  }

  return (
    words[0].charAt(0).toUpperCase() +
    words[1].charAt(0).toUpperCase()
  );
};

const CompanyAvatar = ({ name, logo, size = 40 }) => {
  if (logo) {
    return (
      <img
        src={logo}
        alt={name || "Company logo"}
        style={{ width: size, height: size }}
        className="rounded-full object-cover border"
      />
    );
  }

  return (
    <div
      style={{ width: size, height: size }}
      className="flex items-center justify-center rounded-full 
                 bg-gradient-to-br from-indigo-500 to-purple-600 
                 text-white font-bold border"
    >
      {getInitials(name)}
    </div>
  );
};

export default CompanyAvatar;
