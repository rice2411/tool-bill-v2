import React from "react";
import { useLoading } from "../../context/loading";

const LoadingOverlay = () => {
    const { isLoading } = useLoading();

    if (!isLoading) return null;

    return (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center z-[999]">
            <div className="text-white text-lg font-semibold">Loading...</div>
        </div>
    );
};

export default LoadingOverlay;
