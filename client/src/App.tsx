import React from "react";
//* COMPONENTS
// HEADER
import Header from "./components/header/Header";
//* NPMS
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

function App() {
  return (
    <Router>
      <Header />
      <Routes></Routes>
    </Router>
  );
}

export default App;
