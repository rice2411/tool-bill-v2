import { useState } from "react";
import Button from "../../../../small-components/Button";
import Input from "../../../../small-components/Input";
import { convertNumber, handleCurrencyInput } from "../../../../utils";
import Select from "react-select";

function OtherInput({ billData, peoples, setBillData }) {
    const [personalData, setPersonalData] = useState(
        JSON.parse(billData.personalData)
    );

    const handleUpdateBillData = (newPersonalData) => {
        console.log(newPersonalData);
        const temp = { ...billData };
        temp.personalData = JSON.stringify(newPersonalData);
        temp.total = newPersonalData
            .reduce((total, item) => {
                return total + convertNumber(item.amount);
            }, 0)
            .toString();

        setBillData(temp);
    };

    const handleChange = (e, index) => {
        const temp = [...personalData];
        temp[index] = { ...temp[index], amount: e.target.value };
        setPersonalData(temp);
        handleUpdateBillData(temp);
    };

    const handleSelect = (item, index) => {
        const temp = [...personalData];
        temp[index] = { ...temp[index], id: item.value };
        setPersonalData(temp);
        handleUpdateBillData(temp);
    };

    const handleNewPeronalData = () => {
        const temp = [...personalData];
        temp.push({ id: "", amount: "" });
        setPersonalData(temp);
        handleUpdateBillData(temp);
    };

    const handleRemovePeronalData = (index) => {
        const temp = [...personalData];
        temp.splice(index, 1);
        setPersonalData(temp);
        handleUpdateBillData(temp);
    };
    return (
        <>
            {/* Ăn lẻ */}
            {personalData.map((item, index) => (
                <div className="mb-4 flex justify-between" key={index}>
                    <div>
                        <label
                            htmlFor="cashier"
                            className="block mb-2 text-sm font-medium"
                        >
                            Mục/Người:
                            <span className="text-red-500">*</span>
                        </label>
                        <Select
                            options={peoples
                                .filter(
                                    (people) =>
                                        !personalData.find(
                                            (item) => item.id === people.id
                                        )
                                )
                                .map((people) => ({
                                    value: people.id,
                                    label: people.name,
                                }))}
                            className="w-full "
                            placeholder="Chọn người "
                            defaultValue={
                                peoples
                                    .filter((people) =>
                                        personalData.find(
                                            (item) => item.id === people.id
                                        )
                                    )
                                    .map((people) => ({
                                        value: people.id,
                                        label: people.name,
                                    }))[index]
                            }
                            onChange={(e) => {
                                handleSelect(e, index);
                            }}
                            isDisabled={billData.status}
                        />
                    </div>
                    <div>
                        <div className="flex justify-between">
                            <label
                                htmlFor="cashier"
                                className="block mb-2 text-sm font-medium"
                            >
                                Tiền:
                                <span className="text-red-500">*</span>
                            </label>
                            <span
                                className={`text-sm text-red-500 cursor-pointer ${
                                    billData.status && "hidden"
                                }`}
                                onClick={() => {
                                    handleRemovePeronalData(index);
                                }}
                            >
                                Xóa
                            </span>
                        </div>
                        <Input
                            id="cashier"
                            type="text"
                            required={true}
                            value={handleCurrencyInput(item.amount)}
                            onChange={(e) => {
                                const { value } = e.target;
                                if (
                                    /^\d*$/.test(
                                        Number(value.replace(/,/g, ""))
                                    )
                                ) {
                                    handleChange(e, index);
                                }
                            }}
                            placeholder={"1,200,000,000.."}
                            disabled={billData.status}
                        />
                    </div>
                </div>
            ))}
            {/* Người tham gia */}
            <div className="mb-4">
                <Button
                    text={`+ Thêm`}
                    type="success"
                    onClick={handleNewPeronalData}
                    disabled={
                        personalData.length === peoples.length ||
                        billData.status
                    }
                />
            </div>
        </>
    );
}

export default OtherInput;
