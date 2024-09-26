import minhImage from "../assets/minh.jpg";
import hungImage from "../assets/hung.jpg";
import phuocImage from "../assets/phuoc.jpg";
import ducImage from "../assets/duc.jpg";
import namImage from "../assets/nam.jpg";
import trongImage from "../assets/trong.jpg";

const handleCurrencyInput = (value) => {
    if (!value) return "";
    return Number(value.replace(/,/g, "")).toLocaleString("en-US");
};

const getImage = (name) => {
    switch (name) {
        case "minh":
            return minhImage;
        case "phước":
            return phuocImage;
        case "hùng":
            return hungImage;
        case "trọng":
            return trongImage;
        case "đức":
            return ducImage;
        case "nam":
            return namImage;
        default:
            return "";
    }
};

const convertNumber = (number) => {
    return Number(number.toString().replace(/,/g, ""));
};

const removeComma = (str) => {
    return str.replace(/,/g, "");
};

export { handleCurrencyInput, getImage, convertNumber, removeComma };
