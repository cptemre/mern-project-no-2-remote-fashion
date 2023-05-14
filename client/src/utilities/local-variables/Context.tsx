import { createContext } from "react";
//* UTILITIES
// LOCAL VARIABLES
import { initialState } from "./initialState";
// INTERFACES - INITIAL STATE
import { InitialStateInterface } from "../interfaces/local-data/initialStateInterface";
interface Action {
  type: string;
  payload?: any;
}
interface ContextInterface {
  state: InitialStateInterface;
  dispatch: React.Dispatch<Action>;
}

export const Context = createContext<ContextInterface>({
  state: initialState,
  dispatch: (action: Action) => {},
});
