"use client";

import { createContext, useContext, useState, useEffect } from 'react'
import { UserSession, UserSessionWithToken, LoginData, LoginApiResponse, RefreshApiResponse, SignUpData  } from '@/interface/user'
import { ApiResponse } from '@/interface/api';
import { baseURL, appBaseURL } from '@/app/config'


interface AuthContextData {
  isAuthenticated: boolean
  currentUser: UserSession | null
  accessToken: string | null
  expiryDate: string | null
  logIn: (_data: LoginData) => Promise<void>
  signUp: (_data: SignUpData) => Promise<void>
  logOut: () => Promise<void>
  refreshSession: () => Promise<void>
}

interface AuthProviderProps {
  children: React.ReactNode,
  session: UserSessionWithToken | null,
}

const AuthContext = createContext<AuthContextData>({
  isAuthenticated: false,
  currentUser: null,
  accessToken: null,
  expiryDate: null,
  logIn: () => Promise.resolve(),
  signUp: () => Promise.resolve(),
  logOut: () => Promise.resolve(),
  refreshSession: () => Promise.resolve(),
})


const AuthProvider = ({ children, session }: AuthProviderProps) => {
  const [currentUser, setCurrentUser] = useState<UserSession | null>(session?.userSession || null)
  const [isAuthenticated, setIsAuthenticated] = useState(session !== null)
  const [accessToken, setAccessToken] = useState<string | null>(session?.accessToken || null)
  const [expiryDate, setExpiryDate] = useState<string | null>(session?.expiryDate || null)


  useEffect(() => {
    const timer = setInterval(() => {
      checkTokenExpiration();
    }, 600000); 
    return () => clearInterval(timer);
  }, []);
  useEffect(() => {
    if (accessToken) document.cookie = `access-token=${accessToken}`;
  }, [accessToken]);
  useEffect(() => {
    if (session) {
      setCurrentUser(session.userSession);
      setAccessToken(session.accessToken);
      setIsAuthenticated(true);
      setExpiryDate(session.expiryDate);
    }
  }, [session]);

  const checkTokenExpiration = () => {
    if (!accessToken || !expiryDate) {
      return;
    }
    const currentTime = new Date().getTime();
    if (currentTime >= parseInt(expiryDate, 10) - 300000) { 
      refreshSession();
    }
  };

  const signUp = async (data: SignUpData) => {
    return new Promise<void>((resolve, reject) => {
      fetch(`${appBaseURL}/auth/sign-up`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })
      .then(res => res.json() as Promise<LoginApiResponse>)
      .then((res) => {
        if (res.success && res.data) {
          setCurrentUser(res.data.userSession);
          setAccessToken(res.data.accessToken);
          setIsAuthenticated(true);
          setExpiryDate(res.data.expiryDate);

          resolve();
        } else {
          console.log(res.data, res.message)
          reject(res.message);
        }
      })
      .catch((err) => reject(err))
    })
  }


  const logIn = async (data: LoginData) => {
    return new Promise<void>((resolve, reject) => {
      // Send data to API
      fetch(`${appBaseURL}/auth/sign-in`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })
        .then(res => res.json() as Promise<LoginApiResponse>)
        .then(res => {
          if (res.success && res.data) {
            setCurrentUser(res.data.userSession);
            setAccessToken(res.data.accessToken);
            setIsAuthenticated(true)
            setExpiryDate(res.data.expiryDate);

            resolve()
          } else {
            console.log(res.data, res.message)
            reject(new Error(res.message))
          }
        })
        .catch(err => {
          reject(err)
        })
    })
  }

  const logOut = async () => {
    return new Promise<void>((resolve, reject) => {
      fetch(`${appBaseURL}/auth/logout`, {
        method: 'GET',
      })
      .then(res => res.json() as Promise<ApiResponse<null>>)
      .then((res) => {
        if (res.success) {
          setCurrentUser(null)
          setIsAuthenticated(false)
          setAccessToken('');

          resolve();
        } else {
          console.log(res.data, res.message)
          reject(new Error(res.message))
        }
      })
      .catch(err => {
        reject(err)
      })
    })
  }

  const refreshSession = async () => {
    return new Promise<void>((resolve, reject) => {
      fetch(`${baseURL}/auth/refresh`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })
        .then(res => res.json() as Promise<RefreshApiResponse>)
        .then(res => {
          if (res.success && res.data) {
            setAccessToken(res.data.token);
            setExpiryDate(res.data.expiryDate);

            resolve()
          } else {
            reject(new Error(res.message))
          }
        })
        .catch(err => {
          reject(err)
        })
    })
  }

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        currentUser,
        logIn,
        logOut,
        signUp,
        refreshSession,
        accessToken,
        expiryDate,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

const useAuth = () => {
  // Custom hook to use auth context
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export { AuthContext, AuthProvider, useAuth }