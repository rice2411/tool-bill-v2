import React, { createContext, useContext, useState } from "react";

// Tạo Loading Context
const LoadingContext = createContext();

// Tạo Provider để cung cấp context
export const LoadingProvider = ({ children }) => {
    const [isLoading, setIsLoading] = useState(false);

    const showLoading = () => setIsLoading(true);
    const hideLoading = () => setIsLoading(false);

    return (
        <LoadingContext.Provider
            value={{ isLoading, showLoading, hideLoading }}
        >
            {children}
        </LoadingContext.Provider>
    );
};

// Custom hook để sử dụng Loading context
export const useLoading = () => useContext(LoadingContext);
