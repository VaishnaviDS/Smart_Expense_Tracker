import React from "react";
import { useNavigate } from "react-router-dom";
import "./Home.css";

const Home = () => {

  const navigate = useNavigate();

  return (
    <>
      <div className="home-container">

        {/* HERO SECTION */}
        <section className="hero-section">
          <h1>Smart Expense Tracker</h1>
          <p>
            Manage your income and expenses efficiently using smart automation,
            receipt scanning, and powerful financial dashboards.
          </p>

          <div className="hero-buttons">
            <button
              className="start-btn"
              onClick={() => navigate("/transaction")}
            >
              Get Started
            </button>
          </div>
        </section>


        {/* FEATURES */}
        <section className="features-section">
          <h2>Features</h2>

          <div className="features-grid">

            <div className="feature-card">
              <h3>Add Transactions</h3>
              <p>Quickly add income and expense records manually.</p>
            </div>

            <div className="feature-card">
              <h3>Edit & Delete</h3>
              <p>Modify or remove transactions anytime.</p>
            </div>

            <div className="feature-card">
              <h3>Income & Expense Management</h3>
              <p>Organize financial records with categories.</p>
            </div>

            <div className="feature-card">
              <h3>Financial Dashboard</h3>
              <p>Visualize spending with charts and analytics.</p>
            </div>

            <div className="feature-card">
              <h3>AI Receipt Scanner</h3>
              <p>
                Upload receipts and automatically extract amount,
                category, and date using AI.
              </p>
            </div>

            <div className="feature-card">
              <h3>Prompt-Based Automation</h3>
              <p>
                Enter expenses using natural language like 
                “Paid ₹500 for groceries today”.
              </p>
            </div>

          </div>
        </section>


        {/* TECH STACK */}
        <section className="tech-section">

          <h2>Technology Stack</h2>

          <p className="tech-desc">
            Built using modern full-stack technologies to ensure performance,
            scalability, and secure financial data management.
          </p>

          <div className="tech-grid">

            <div className="tech-card">
              <h3>Frontend</h3>
              <p>React.js, CSS, Recharts</p>
            </div>

            <div className="tech-card">
              <h3>Backend</h3>
              <p>Node.js, Express.js</p>
            </div>

            <div className="tech-card">
              <h3>Database</h3>
              <p>MongoDB with Mongoose</p>
            </div>

            <div className="tech-card">
              <h3>Authentication</h3>
              <p>JWT Secure Login System</p>
            </div>

            <div className="tech-card">
              <h3>AI Integration</h3>
              <p>Gemini API for receipt scanning & prompt automation</p>
            </div>

            <div className="tech-card">
              <h3>Data Visualization</h3>
              <p>Recharts for financial analytics</p>
            </div>

          </div>

        </section>


        {/* HOW IT WORKS */}
        <section className="how-section">

          <h2>How It Works</h2>

          <div className="steps-grid">

            <div className="step-card">
              <span>1</span>
              <h3>Add Transactions</h3>
              <p>Add expenses manually, via AI prompts, or by scanning receipts.</p>
            </div>

            <div className="step-card">
              <span>2</span>
              <h3>Track Finances</h3>
              <p>Monitor income, expenses, and balance in real time.</p>
            </div>

            <div className="step-card">
              <span>3</span>
              <h3>Analyze Spending</h3>
              <p>Use charts and dashboards to understand financial patterns.</p>
            </div>

          </div>

        </section>


        {/* CTA */}
        <section className="cta-section">

          <h2>Start Managing Your Money Smarter</h2>

          <p>
            Automate expense tracking using AI and visualize your financial habits.
          </p>

          <button
            className="cta-btn"
            onClick={() => navigate("/dashboard")}
          >
            Start Tracking Now
          </button>

        </section>

      </div>
    </>
  );
};

export default Home;