import React, { createContext, useState } from 'react';

// Create the context
export const UserContext = createContext();

// Provider component
export const UserProvider = ({ children }) => {
    const [user, setUser] = useState({ email: '', token: '' });

    return (
        <UserContext.Provider value={{ user, setUser }}>
            {children}
        </UserContext.Provider>
    );
};
