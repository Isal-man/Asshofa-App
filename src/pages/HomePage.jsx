import { useContext, useEffect } from "react";
import { ProtectedRoute } from "../components";
import { AuthContext } from "../App";

export const HomePage = () => {
  const { token } = useContext(AuthContext);

  useEffect(() => {}, [token]);

  return (
    <ProtectedRoute>
      <div className="flex justify-center items-center h-screen w-screen">
        <h1>HOME PAGE</h1>
        <label htmlFor="file" className="p-5 bg-blue-300 rounded-lg">Input File </label>
        <input type="file" id="file" className="hidden" />
      </div>
    </ProtectedRoute>
  );
};
