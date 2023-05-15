import React, { useReducer, createContext } from "react";
//* COMPONENTS
// HEADER
import Header from "./components/header/Header";
//* NPMS
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
//* UTILITIES
// REDUCER - DEFAULT STATE
import { reducer, initialState, Context } from "./utilities/local-variables";
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
