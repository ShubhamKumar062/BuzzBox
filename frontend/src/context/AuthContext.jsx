import { createContext, useContext, useReducer, useEffect } from "react";
import api from "../utils/axiosInstance";
import { useLocalStorage } from "../hooks/useLocalStorage";

const AuthContext = createContext();

const initialState = {
  user: null,
  isAuthenticated: false,
  loading: false,
};

const authReducer = (state, action) => {
  switch (action.type) {
    case "SET_LOADING":
      return { ...state, loading: action.payload };

    case "LOGIN_SUCCESS":
    case "SIGNUP_SUCCESS":
      return {
        ...state,
        user: action.payload,
        isAuthenticated: true,
        loading: false,
      };

    case "LOGOUT":
      return { ...state, user: null, isAuthenticated: false };

    default:
      return state;
  }
};

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);
  const [storedUser, setStoredUser] = useLocalStorage("buzzbox_user", null);
  const [storedToken, setStoredToken] = useLocalStorage("token", null);

  useEffect(() => {
    if (storedUser && storedToken) {
      dispatch({ type: "LOGIN_SUCCESS", payload: storedUser });
    }
  }, []);

  useEffect(() => {
    setStoredUser(state.user);
  }, [state.user]);

  const login = async (credentials) => {
    dispatch({ type: "SET_LOADING", payload: true });
    try {
      const res = await api.post("/auth/login", credentials);
      const { user, token } = res.data;

      localStorage.setItem("token", token);
      setStoredToken(token);
      


      dispatch({ type: "LOGIN_SUCCESS", payload: user });
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error?.response?.data?.message || "Login failed",
      };
    }
  };

  const signup = async (data) => {
    dispatch({ type: "SET_LOADING", payload: true });
    try {
      const res = await api.post("/auth/register", data);
      const { user, token } = res.data;

      localStorage.setItem("token", token);
      setStoredToken(token);
    
      dispatch({ type: "SIGNUP_SUCCESS", payload: user });
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error?.response?.data?.message || "Signup failed",
      };
    }
  };

  const logout = () => {
    dispatch({ type: "LOGOUT" });
    localStorage.removeItem("token");
    setStoredToken(null);
  };

  return (
    <AuthContext.Provider value={{ ...state, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used inside AuthProvider");
  return context;
};
