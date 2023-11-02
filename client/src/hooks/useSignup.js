import { useState } from "react";
import { useAuthContext } from "./useAuthContext";

export const useTenantSignup = () => {
  const [signupError, setError] = useState(null);
  const [signupisLoading, setIsLoading] = useState(null);
  const { user } = useAuthContext();

  const signup = async (email, password, propertyid) => {
    setIsLoading(true);
    setError(null);
    
    const response = await fetch("/api/tenant/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json",
      "authorization":`Bearer ${user.token}`
     },
      body: JSON.stringify({ email, password, propertyid }),
    });

    const json = await response.json();

    if (!response.ok) {
      setIsLoading(false);
      setError(json.error);
    }
    if (response.ok) {
      //save user to local storage
      // localStorage.setItem("user", JSON.stringify(json));

      // user({ type: "LOGIN", payload: json });
      setIsLoading(false);
    }
    return response;
  };
  return { signup, signupisLoading, signupError, setError, setIsLoading };
};

export const useLandlordSignup = () => {
  const [signupError, setError] = useState(null);
  const [signupisLoading, setIsLoading] = useState(null);
  const { user } = useAuthContext();

  const signup = async (email, password) => {
    setIsLoading(true);
    setError(null);

    const response = await fetch("/api/landlord/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json",
     "authorization":`Bearer ${user.token}`},
      body: JSON.stringify({ email, password }),
    });

    const json = await response.json();

    if (!response.ok) {
      setIsLoading(false);
      setError(json.error);
    }
    if (response.ok) {
      //save user to local storage
      // localStorage.setItem("user", JSON.stringify(json));

      // user({ type: "LOGIN", payload: json });
      setIsLoading(false);
    }
    return response;
  };
  return { signup, signupisLoading, signupError, setError, setIsLoading };
};
