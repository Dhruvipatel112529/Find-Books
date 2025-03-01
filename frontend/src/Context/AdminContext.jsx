import { createContext, useState, useContext, useEffect } from "react";
import Cookies from "js-cookie";
import Load from "../components/Load";


const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user,setUser] = useState(null);
    const [loading, setLoading] = useState(true);

      useEffect(() => {
        const getuser = async () => {
          try{
            const response = await fetch("http://localhost:2606/api/User", {
              method : "GET",
              credentials: "include",
          });
          
          const json = await response.json();
          
          setUser(json.user);
          }catch(error){
            console.error("Error fetching user data:", error);
            setUser(null); 
          }
          finally {
            setLoading(false);  // Stop loading once the data is fetched
        }
        };
    
        getuser();
      },[]);

    return(
        <AuthContext.Provider value={{user,loading}}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext); 