import { ActionInterface, InitialStateInterface } from ".";

interface ContextInterface {
  state: InitialStateInterface;
  dispatch: React.Dispatch<ActionInterface>;
}

export type { ContextInterface };
