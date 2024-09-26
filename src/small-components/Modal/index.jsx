import React from "react";
import Button from "../Button";

const Modal = ({ isOpen, onClose, children }) => {
    if (!isOpen) return null;

    return (
        <div
            onClick={(e) => {
                if (e.target.id === "modal") onClose();
            }}
            id="modal"
            className="absolute inset-0 bg-gray-300 bg-opacity-50  h-full  flex items-center justify-center z-50 overflow-y-auto"
        >
            <div className="bg-white w-auto mx-auto p-6 rounded-lg shadow-lg relative mt-52  md:mt-0">
                {/* Modal Content */}
                <div>{children}</div>

                {/* Close Button */}
                <Button
                    text={`Đóng`}
                    onClick={onClose}
                    type={"danger"}
                    className="mt-5"
                />
            </div>
        </div>
    );
};

export default Modal;
