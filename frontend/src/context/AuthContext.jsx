import { createContext, useContext, useReducer, useEffect } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';

const AuthContext = createContext();

const initialState = {
  user: null,
  isAuthenticated: false,
  users: [
    { 
      id: 'admin1', 
      email: 'admin@buzzbox.com', 
      name: 'Admin User', 
      role: 'admin',
      avatar: 'AU',
      status: 'active',
      createdAt: new Date('2024-01-01').toISOString()
    },
    { 
      id: 'user1', 
      email: 'user@example.com', 
      name: 'John Doe', 
      role: 'user',
      avatar: 'JD',
      status: 'active',
      createdAt: new Date('2024-01-15').toISOString()
    }
  ],
  loading: false
};

const authReducer = (state, action) => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    
    case 'LOGIN_SUCCESS':
      return {
        ...state,
        user: action.payload,
        isAuthenticated: true,
        loading: false
      };
    
    case 'SIGNUP_SUCCESS':
      return {
        ...state,
        user: action.payload,
        isAuthenticated: true,
        users: [...state.users, action.payload],
        loading: false
      };
    
    case 'LOGOUT':
      return {
        ...state,
        user: null,
        isAuthenticated: false
      };
    
    case 'TOGGLE_USER_STATUS':
      return {
        ...state,
        users: state.users.map(user =>
          user.id === action.payload
            ? { ...user, status: user.status === 'active' ? 'suspended' : 'active' }
            : user
        )
      };
    
    default:
      return state;
  }
};

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);
  const [storedUser, setStoredUser] = useLocalStorage('buzzbox_user', null);
  const [storedUsers, setStoredUsers] = useLocalStorage('buzzbox_users', initialState.users);

  useEffect(() => {
    if (storedUser) {
      dispatch({ type: 'LOGIN_SUCCESS', payload: storedUser });
    }
    if (storedUsers) {
      dispatch({ type: 'SET_USERS', payload: storedUsers });
    }
  }, [storedUser, storedUsers]);

  useEffect(() => {
    if (state.user) {
      setStoredUser(state.user);
    } else {
      setStoredUser(null);
    }
  }, [state.user, setStoredUser]);

  useEffect(() => {
    setStoredUsers(state.users);
  }, [state.users, setStoredUsers]);

  const login = async (credentials) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      const user = state.users.find(u => 
        u.email === credentials.email && 
        u.status !== 'suspended'
      );
      
      if (user) {
        dispatch({ type: 'LOGIN_SUCCESS', payload: user });
        localStorage.setItem("token", response.data.token);
        return { success: true };
      } else {
        return { success: false, error: 'Invalid credentials or account suspended' };
      }
    } catch (error) {
      return { success: false, error: 'Login failed' };
    }
  };

  const signup = async (userData) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      const existingUser = state.users.find(u => u.email === userData.email);
      if (existingUser) {
        return { success: false, error: 'Email already registered' };
      }
      
      const newUser = {
        ...userData,
        id: `user_${Date.now()}`,
        status: 'active',
        createdAt: new Date().toISOString()
      };
      
      dispatch({ type: 'SIGNUP_SUCCESS', payload: newUser });
      return { success: true };
    } catch (error) {
      return { success: false, error: 'Signup failed' };
    }
  };

  const logout = () => {
    dispatch({ type: 'LOGOUT' });
  };

  const toggleUserStatus = (userId) => {
    dispatch({ type: 'TOGGLE_USER_STATUS', payload: userId });
  };

  return (
    <AuthContext.Provider value={{
      ...state,
      login,
      signup,
      logout,
      toggleUserStatus
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};