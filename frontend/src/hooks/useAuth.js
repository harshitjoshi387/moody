import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

// Custom hook to use AuthContext easily
export default function useAuth() {
  return useContext(AuthContext);
}
