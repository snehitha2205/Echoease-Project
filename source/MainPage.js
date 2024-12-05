import React from 'react';
import { Button, Container, Row, Col } from 'react-bootstrap';
import './MainPage.css';

const MainPage = () => {
  return (
    <div className="main-page">
      {/* Hero Section */}
      <header className="hero-section">
        <Container>
          <Row className="align-items-center">
            <Col md={6}>
              <h1 className="hero-title">Welcome to Your Smart Automation Platform</h1>
              <p className="hero-description">
                Simplifying workflows, enhancing productivity, and automating daily tasks—all in one platform.
              </p>
              <Button variant="primary" className="cta-button">Explore More</Button>
            </Col>
            <Col md={6}>
              <img src="https://your-image-url.com/automation-image.jpg" alt="Automation" className="hero-image" />
            </Col>
          </Row>
        </Container>
      </header>

      {/* Features Section */}
      <section className="features-section">
        <Container>
          <h2 className="section-title">Why Choose Our Platform?</h2>
          <Row>
            <Col md={4}>
              <div className="feature-card">
                <h3 className="feature-title">Automation</h3>
                <p>Streamline your tasks and automate repetitive actions effortlessly.</p>
              </div>
            </Col>
            <Col md={4}>
              <div className="feature-card">
                <h3 className="feature-title">User-Friendly</h3>
                <p>Our intuitive interface ensures a smooth experience for all users.</p>
              </div>
            </Col>
            <Col md={4}>
              <div className="feature-card">
                <h3 className="feature-title">Secure & Reliable</h3>
                <p>Keep your data safe with top-level security protocols and seamless updates.</p>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <Container>
          <h2 className="cta-title">Get Started Today</h2>
          <Button variant="success" className="cta-button">Join Now</Button>
        </Container>
      </section>

      {/* Footer */}
      <footer className="footer">
        <Container>
          <Row>
            <Col md={6}>
              <p>&copy; 2024 Smart Automation Platform. All Rights Reserved.</p>
            </Col>
            <Col md={6} className="text-right">
              <a href="#">Privacy Policy</a> | <a href="#">Terms of Service</a>
            </Col>
          </Row>
        </Container>
      </footer>
    </div>
  );
};

export default MainPage;
