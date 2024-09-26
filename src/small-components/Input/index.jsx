import React from "react";
import { DEFAULT_INPUT_CLASS } from "./constant";
// BASE UI INPUT
function Input({
    id,
    type,
    className,
    placeholder,
    name,
    value,
    disabled = false,
    onChange = () => {},
    required = false,
}) {
    return (
        <input
            type={type || "text"}
            id={id}
            value={value}
            name={name}
            className={` ${DEFAULT_INPUT_CLASS} ${className}`}
            placeholder={placeholder}
            required={required}
            onChange={onChange}
            disabled={disabled}
        />
    );
}

export default Input;
