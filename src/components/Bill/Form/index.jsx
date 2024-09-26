import { useState } from "react";
import BillInput from "../Input";
import Bill from "../UI";
import { toast } from "react-toastify";
import {
    createDocuments,
    db,
    updateDocuments,
} from "../../../service/firebase";
import { BILLIARDS, DEFAULT_VALUE_BILL_DATA, OTHER } from "../constant";
import { removeComma } from "../../../utils";

const BillForm = ({ peoples, type, data, revalidator }) => {
    const [billData, setBillData] = useState(data || DEFAULT_VALUE_BILL_DATA);

    const handleNewPeronalData = () => {
        const cloneBillData = { ...billData };
        const personalData = JSON.parse(cloneBillData.personalData);
        personalData.push({ label: "", value: "" });
        cloneBillData.personalData = JSON.stringify(personalData);
        setBillData(cloneBillData);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setBillData({ ...billData, [name]: value });
    };

    const handleSubmit = async () => {
        const payload = { ...billData };
        payload.total = removeComma(payload.total);
        if (billData.subtitle === OTHER) {
            const personalData = JSON.parse(payload.personalData);
            personalData.forEach((item) => {
                item.amount = removeComma(item.amount);
            });
        }

        type === "create"
            ? await createDocuments("bills", payload)
            : await updateDocuments("bills", payload);
        toast.success("Beutifullllll 🦄");
        setBillData(DEFAULT_VALUE_BILL_DATA);
        revalidator.revalidate();
        return;
    };

    return (
        <div className="flex flex-col md:flex-row  bg-white  shadow-md border boder-stone-500  ">
            <BillInput
                handleSubmit={handleSubmit}
                peoples={peoples}
                billData={billData}
                setBillData={setBillData}
                handleChange={handleChange}
                handleNewPeronalData={handleNewPeronalData}
                type={type}
            />
            <Bill peoples={peoples} billData={billData} />
        </div>
    );
};

export default BillForm;
