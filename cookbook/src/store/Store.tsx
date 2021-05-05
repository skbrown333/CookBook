import React, { createContext, useReducer } from "react";
import { Reducer } from "./reducers";
import { InitialState, AppContext } from "./initial-state";

export const Store = ({ children }) => {
  const [state, dispatch] = useReducer(Reducer, InitialState);
  return (
    <Context.Provider value={[state, dispatch]}>{children}</Context.Provider>
  );
};

export const Context = createContext<any>(InitialState);
