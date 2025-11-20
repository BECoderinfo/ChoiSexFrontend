import React from "react";
import "./ComingSoon.css";
import comingSoonImg from "../assets/comingsoon.png";
import { useNavigate } from "react-router-dom";
import { Button } from "react-bootstrap";


function ComingSoon() {
    const navigate = useNavigate();
  return (
    <div className="coming-soon-container">
      <img 
        src={comingSoonImg}
        alt="Coming Soon" 
        className="coming-soon-img" 
      />
      <p>We’re working on adding something amazing here!</p>

      <Button variant="primary" onClick={() => navigate("/")} className="hero-btn">Shop Now</Button>
    </div>
  );
}

export default ComingSoon;
