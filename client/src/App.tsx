import React, { useEffect, useReducer } from "react";
//* COMPONENTS
// HEADER
import Header from "./components/header/Header";
//* NPMS
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
//* UTILITIES
// REDUCER - INITIAL STATE - CONTEXT
import reducer from "./utilities/local-variables/reducer";
import { Context } from "./utilities/local-variables/Context";
import initialState from "./utilities/local-variables/initialState";
// CONTEXT
function App() {
  const [state, dispatch] = useReducer(reducer, initialState);
  return (
    <Router>
      <Context.Provider value={{ state, dispatch }}>
        <Header />
      </Context.Provider>
      <Routes></Routes>
    </Router>
  );
}

export default App;
