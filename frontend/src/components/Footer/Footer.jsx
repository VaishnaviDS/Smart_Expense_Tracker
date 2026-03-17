import React from "react";
import "./Footer.css";

const Footer = () => {
  return (
    <footer className="footer">

      <div className="footer-container">

        <div className="footer-brand">
          <h3>Smart Expense Tracker</h3>
          <p>
            A modern financial tracking platform powered by AI insights.
          </p>
        </div>

      </div>

      <div className="footer-bottom">
        © {new Date().getFullYear()} Smart Expense Tracker. All rights reserved.
      </div>

    </footer>
  );
};

export default Footer;