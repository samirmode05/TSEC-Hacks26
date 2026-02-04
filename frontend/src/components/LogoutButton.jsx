
import React from "react";
import { useAuth } from "../context/AuthProvider";

const LogoutButton = () => {
    const { signOut } = useAuth();

    const handleLogout = async () => {
        await signOut();
    };

    return (
        <button onClick={handleLogout}>
            Log Out
        </button>
    );
};

export default LogoutButton;
