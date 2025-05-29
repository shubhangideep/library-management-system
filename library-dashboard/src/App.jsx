import React from "react";
import './App.css';
import Dashboard from "./components/Dashboard";
import Authors from "./components/Authors";
import Borrowers from "./components/Borrowers";
import Loans from "./components/Loans";

function App() {
  return (
    <>
      <div className="header">
  <div className="header-content">
    <img src="/mirai_school_of_technology_logo.png" alt="Mirai Logo" className="logo" />
    <span>Library Management System</span>
  </div>
</div>


      <div className="container">
        <div className="section">
          <Dashboard />
        </div>
        <div className="section">
          <Authors />
        </div>
        <div className="section">
          <Borrowers />
        </div>
        <div className="section">
          <Loans />
        </div>
      </div>
    </>
  );
}

export default App;

