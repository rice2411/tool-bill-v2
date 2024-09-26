import { BUTTON_TYPE } from "./constant";

function Button({
    text,
    onClick,
    className = '',
    disabled = false,
    type = 'primary'
}) {
    return (
        <button
            onClick={onClick}
            type="button"
            className={`${BUTTON_TYPE[type]} ${className} ${disabled && '!bg-gray-300'}`}
            disabled={disabled}>
            {text}
        </button>
    );
}

export default Button;