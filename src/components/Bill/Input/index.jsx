import { useEffect } from "react";
import Select from "react-select";
import Input from "../../../small-components/Input";
import RadioBUttons from "../../../small-components/RadioButton";
import Button from "../../../small-components/Button";
import { BILLIARDS, DEFAULT_SUBTITLE, OTHER } from "../constant";
import { handleCurrencyInput } from "../../../utils";
import BilliardInput from "./Billiards";
import OtherInput from "./Other";

const BillInput = ({
    peoples,
    billData,
    handleChange,
    handleSubmit,
    handleNewPeronalData,
    setBillData,
    type,
}) => {
    const validData = () => {
        const {
            subtitle,
            cashier,
            total,
            exactDate,
            peoples,
            personalData,
            status,
        } = billData;
        if (status) {
            return false;
        }

        if (subtitle === BILLIARDS) {
            if (!cashier || !total || !exactDate || !peoples) {
                return false;
            }
        }

        if (subtitle === OTHER) {
            if (!cashier || !exactDate) {
                return false;
            }

            const arr = JSON.parse(personalData || "[]");
            if (
                !arr.length ||
                arr.some((item) => item.amount === "" || item.id === "")
            ) {
                return false;
            }
        }

        return true;
    };

    return (
        <div className=" mx-auto bg-white p-6  min-w-[400px]  ">
            {/* Loại bill */}
            <label className="block mb-2 text-sm font-medium  ">
                Loại bill:
            </label>

            <RadioBUttons
                data={DEFAULT_SUBTITLE}
                handleChange={handleChange}
                defaultValue={billData.subtitle}
                disabled={type === "edit"}
            ></RadioBUttons>
            {/* Thu Ngân */}
            <div className="mb-4 flex justify-between">
                <div>
                    <label
                        htmlFor="cashier"
                        className="block mb-2 text-sm font-medium"
                    >
                        Thu Ngân:
                        <span className="text-red-500">*</span>
                    </label>
                    <Input
                        id="cashier"
                        type="text"
                        name={"cashier"}
                        required={true}
                        placeholder={"Người tạo.."}
                        value={billData.cashier}
                        onChange={handleChange}
                        disabled={billData.status}
                    />
                </div>

                {/* Ngày thực tế */}
                <div>
                    <label
                        htmlFor="date"
                        className="block mb-2 text-sm font-medium "
                    >
                        Ngày:
                        <span className="text-red-500">*</span>
                    </label>
                    <Input
                        id="date"
                        type="date"
                        name="exactDate"
                        required={true}
                        value={billData.exactDate}
                        onChange={handleChange}
                        disabled={billData.status}
                    />
                </div>
            </div>
            {billData.subtitle === BILLIARDS && (
                <BilliardInput
                    handleChange={handleChange}
                    billData={billData}
                    peoples={peoples}
                />
            )}
            {billData.subtitle === OTHER && (
                <OtherInput
                    handleNewPeronalData={handleNewPeronalData}
                    billData={billData}
                    peoples={peoples}
                    setBillData={setBillData}
                />
            )}

            {/* Ghi chú */}

            <div className="mb-4">
                <label
                    htmlFor="date"
                    className="block mb-2 text-sm font-medium "
                >
                    Ghi chú:
                </label>
                <Input
                    id="note"
                    type="text"
                    name="note"
                    value={billData.note}
                    onChange={handleChange}
                    placeholder={"Ghi chú lên"}
                    disabled={billData.status}
                />
            </div>
            {/* Submit */}
            <Button
                text={`${type === "create" ? "Lên" : "Chỉnh sửa"} bill`}
                onClick={handleSubmit}
                disabled={!validData()}
            />
        </div>
    );
};
export default BillInput;
