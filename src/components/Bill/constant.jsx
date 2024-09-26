const DEFAULT_MESS = `Beutifullllll 🦄`;

const BILLIARDS = `billiards`;

const OTHER = `other`;

const DEFAULT_SUBTITLE = [
    {
        id: BILLIARDS,
        name: "subtitle",
        value: BILLIARDS,
        text: "Billiard / Ăn chung",
    },
    {
        id: OTHER,
        name: "subtitle",
        value: OTHER,
        text: "Ăn lẻ",
        className: "ms-2",
    },
];

const DEFAULT_VALUE_BILL_DATA = {
    subtitle: BILLIARDS,
    billNumber: "000001",
    updatedDate: new Date().toISOString().slice(0, 10),
    updateHour: "22:00",
    createdDate: new Date().toISOString().slice(0, 10),
    createdHour: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
    }),
    cashier: "",
    timeIn: "22:00",
    timeOut: "0:00",
    exactDate: "",
    pricePerHour: "65,000",
    total: "",
    peoples: "",
    status: false,
    personalData: "[]",
    note: "",
};

export {
    DEFAULT_SUBTITLE,
    DEFAULT_VALUE_BILL_DATA,
    BILLIARDS,
    OTHER,
    DEFAULT_MESS,
};
