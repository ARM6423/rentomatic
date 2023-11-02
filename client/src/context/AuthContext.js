import { createContext, useReducer, useEffect } from "react";

export const AuthContext = createContext();

export const authReducer = (state, action) => {
  switch (action.type) {
    case "LOGIN":
      return { user: action.payload };
    case "LOGOUT":
      return { user: null };
    default:
      return state;
  }
};

export const AuthContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, {
    user: null,
  });

  useEffect(() => {
    const initializeState = () => !!JSON.parse(localStorage.getItem("user"));
    const user = JSON.parse(localStorage.getItem("user"));

    if (initializeState) {
      dispatch({ type: "LOGIN", payload: user });
    }
  }, []);

  console.log("Auth Context State: ", state);

  return (
    <AuthContext.Provider value={{ ...state, dispatch }}>
      {children}
    </AuthContext.Provider>
  );
};
