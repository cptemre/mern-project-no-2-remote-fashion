import { createContext } from "react";
//* UTILITIES
// LOCAL VARIABLES
import initialState from "./initialState";
// INTERFACES - INITIAL STATE
import { ActionInterface, ContextInterface } from "../interfaces/local-data";

export const Context = createContext<ContextInterface>({
  state: initialState,
  dispatch: (action: ActionInterface) => {},
});
