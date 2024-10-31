import React from "react";

export const HeroBanner: React.FC = () => {
  const logo = "https://cdn.auth0.com/blog/developer-hub/react-logo.svg";

  return (
    <div className="hero-banner hero-banner--blue-aqua">
      <h1>Welcome to LockBox!</h1>
      <p className="hero-banner__description">LockBox is an online solution to help you securely store files in the cloud.</p>
    </div>
  );
};
