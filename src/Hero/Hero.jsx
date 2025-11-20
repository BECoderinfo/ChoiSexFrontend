import React from "react";
import { Container, Button } from "react-bootstrap";
import "./Hero.css";
import heroBg from "../assets/hero.png";

const Hero = () => {
  return (
    <div
      className="hero-img d-flex align-items-center justify-content-center"
      style={{ backgroundImage: `url(${heroBg})` }}
    >
      <Container className="text-center hero-content">
        <h1 className="hero-title">
          Wanna Know What Your Faves<br />Are Raving About?
        </h1>
        <p className="hero-subtitle">
          Click To Make Them Yours <span className="highlight">NOW!!!</span>
        </p>
        <Button className="hero-btn">Buy Now</Button>
      </Container>
    </div>
  );
};

export default Hero;
