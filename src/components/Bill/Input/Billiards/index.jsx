import Select from "react-select";
import { handleCurrencyInput } from "../../../../utils";
import Input from "../../../../small-components/Input";
import { BILLIARDS } from "../../constant";
function BilliardInput({ billData, handleChange, peoples }) {
    const handleSelect = (data) => {
        const payload = {
            target: {
                name: "peoples",
                value: data.map((item) => item.value).join(","),
            },
        };
        handleChange(payload);
    };
    return (
        <>
            {billData.subtitle === BILLIARDS && (
                <div className="mb-4">
                    <label
                        htmlFor="date"
                        className="block mb-2 text-sm font-medium "
                    >
                        Thành tiền:
                        <span className="text-red-500">*</span>
                    </label>
                    <Input
                        id="total"
                        type="text"
                        name="total"
                        required={true}
                        value={handleCurrencyInput(billData.total)}
                        onChange={(e) => {
                            const { value } = e.target;
                            if (/^\d*$/.test(Number(value.replace(/,/g, "")))) {
                                handleChange(e);
                            }
                        }}
                        placeholder={"1,200,000,000.."}
                        disabled={billData.status}
                    />
                </div>
            )}

            {/* Người tham gia */}
            {billData.subtitle === BILLIARDS && (
                <div className="mb-4">
                    <label
                        htmlFor="date"
                        className="block mb-2 text-sm font-medium "
                    >
                        Người tham gia:
                        <span className="text-red-500">*</span>
                    </label>
                    <Select
                        isMulti
                        options={peoples
                            // .filter((people) => !selectedPeopleIds.has(people.id))
                            .map((people) => ({
                                value: people.id,
                                label: people.name,
                            }))}
                        className="mt-1"
                        placeholder="Chọn người tham gia..."
                        onChange={handleSelect}
                        defaultValue={peoples
                            .filter((people) =>
                                billData.peoples.includes(people.id)
                            )
                            .map((people) => ({
                                value: people.id,
                                label: people.name,
                            }))}
                        isDisabled={billData.status}
                    />
                </div>
            )}
        </>
    );
}

export default BilliardInput;
