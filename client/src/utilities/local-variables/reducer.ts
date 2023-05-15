// INITIAL STATE INTERFACE
import { InitialStateInterface } from "../interfaces/local-data/initialStateInterface";

const reducer = (
  state: InitialStateInterface,
  action: {
    type: string;
    payload: any;
  }
) => {
  if (action.type === "TEST") {
    console.log(action.payload);
    return { ...state, localVariables: action.payload };
  }
  return state;
};

export default reducer;
