import React from 'react';
import './aboutUs.css';
import { useNavigate } from 'react-router-dom';

const AboutUs = () => {

  const navigate = useNavigate();

  const goCourse = ()=>{
    navigate("/courses");
  }

  return (
    <div className="about-us-container">
      <section className="hero-section">
        <h1>Empowering Your Skill Journey with SkillVoyage</h1>
        <p>
          SkillVoyage is your trusted platform for professional growth and lifelong learning. 
          Our mission is to bridge the gap between learners and industry experts, offering 
          courses designed to empower you with the knowledge and skills needed to thrive 
          in today’s competitive world.
        </p>
      </section>

      <section className="about-section">
        <h2>About Us</h2>
        <p>
          At SkillVoyage, we believe that learning is a continuous voyage. We offer a wide 
          range of expert-led courses, available on demand. Whether you're advancing in your 
          career, exploring new skills, or staying ahead in your industry, our platform 
          offers flexible learning experiences tailored to your needs.
        </p>
      </section>

      <section className="value-section">
        <h2>Why SkillVoyage?</h2>
        <ul>
          <li><strong>Expert-Led Courses:</strong> Courses by top industry leaders.</li>
          <li><strong>On-Demand Learning:</strong> Access anytime, anywhere.</li>
          <li><strong>Outcome-Focused:</strong> Practical knowledge to drive your success.</li>
        </ul>
      </section>

      <section className="mission-section">
        <h2>Our Mission</h2>
        <p>
          We aim to democratize access to world-class education by partnering with passionate 
          professionals who teach real-world skills. Our mission is to empower individuals and 
          organizations to grow, develop, and succeed.
        </p>
      </section>

      <section className="cta-section">
        <h2>Start Your Learning Journey</h2>
        <p>
          Join thousands of learners who trust SkillVoyage to help them grow. Discover the 
          right course for you today.
        </p>
        <button className="cta-button" onClick={goCourse}>Explore Courses</button>
      </section>

      {/* Footer with Credit Bar */}
      <footer className="credit-bar">
        <p>
          &copy; 2024 SkillVoyage. All rights reserved. | Designed and Developed by <a href="https://yourportfolio.com">Dash</a>
        </p>
      </footer>
    </div>
  );
};

export default AboutUs;