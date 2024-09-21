import React from "react";
import { useNavigate } from "react-router-dom";
import "./HomeContent.css";

const HomeContent = () => {
  const navigate = useNavigate();

  const handleCheckProgress = () => {
    navigate("/quiz");
  };

  const handleScoreboard = () => {
    navigate("/scoreboard");
  };

  return (
    <div>
      <div className="Homepage">
        <div className="banner-container">
          <div className="text-container">
            <div className="text-content">
              <h1>
                Taking <span className="highlight-student">student</span>{" "}
                experience to the{" "}
                <span className="highlight-next">next level</span>
              </h1>
              <p className="subtext">
                Transform your immigrant career journey into a guided,
                skill-building adventure
              </p>
              <div className="button-container">
                <button className="progress-button" onClick={handleCheckProgress}>
                  Check your progress
                </button>
                <button className="scoreboard-button" onClick={handleScoreboard}>
                  Scoreboard
                </button>
              </div>
            </div>
          </div>

          <div className="vertical-line"></div>

          <div className="graphic-container">
            <div className="arches">
              <div className="arch arch1"></div>
              <div className="arch arch2"></div>
              <div className="arch arch3"></div>
            </div>
            <div className="dots">
              {/* Dot elements */}
            </div>
          </div>
        </div>
      </div>

      <div className="footer">
        <p>Credits: Created by Dash</p>
        <p>
          Connect with us:
          <a href="#" onClick={(e) => e.preventDefault()}>
            Facebook
          </a>
          ,
          <a href="#" onClick={(e) => e.preventDefault()}>
            Twitter
          </a>
          ,
          <a href="#" onClick={(e) => e.preventDefault()}>
            Email
          </a>
        </p>
      </div>
    </div>
  );
};

export default HomeContent;
