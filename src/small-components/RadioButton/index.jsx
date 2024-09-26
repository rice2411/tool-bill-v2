import React from "react";
function RadioBUttons(
    {
        data,
        defaultValue,
        isRow = true,
        disabled = false,
        handleChange = () => { }

    }
) {
    return (
        <>
            <div className={`flex ${isRow ? 'items-center ' : 'flex-col'} mb-4`}>
                {
                    data.map((radio) =>
                        <div className="flex items-center" key={radio.id}>
                            <input
                                id={radio.id}
                                type="radio"
                                value={radio.value}
                                name={radio.name}
                                className={`w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 ${radio.className}`}
                                onChange={handleChange}
                                checked={defaultValue === radio.value}
                                disabled={disabled}
                            />
                            <label htmlFor={radio.id} className="ms-2 text-sm font-medium text-gray-900 ">{radio.text}</label>
                        </div>)
                }

            </div>
        </>
    );
}

export default RadioBUttons;