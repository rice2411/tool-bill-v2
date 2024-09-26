import { useEffect, useState } from "react";
import { getDocumentById } from "../../../service/firebase";
import { useLoading } from "../../../context/loading";
import { convertNumber, getImage, handleCurrencyInput } from "../../../utils";
import { BILLIARDS, OTHER } from "../../Bill/constant";

function StatementDetail({ statement, peoples }) {
    const { showLoading, hideLoading } = useLoading();
    const [data, setData] = useState([]);

    const fetchData = async () => {
        showLoading();
        try {
            // Lấy tất cả các bills dựa trên ids
            const bills = await Promise.all(
                statement.billsId.map((id) => getDocumentById("bills", id))
            );

            // Lấy danh sách các id của những người liên quan, loại bỏ trùng lặp
            let peopleId = [
                ...new Set(
                    bills.flatMap(({ peoples, personalData }) => {
                        const ids = [];
                        if (peoples) ids.push(...peoples.split(","));
                        if (personalData)
                            ids.push(
                                ...JSON.parse(personalData).map(({ id }) => id)
                            );
                        return ids;
                    })
                ),
            ];

            // Tạo danh sách kết quả từ peoples và tính toán số tiền cho mỗi người
            const result = peopleId.map((id) => {
                let amount = 0;
                bills.forEach((bill) => {
                    if (bill.subtitle === BILLIARDS) {
                        if (bill.peoples.includes(id)) {
                            amount +=
                                convertNumber(bill.total) /
                                bill.peoples.split(",").length;
                        }
                    }
                    if (bill.subtitle === OTHER) {
                        const temp = JSON.parse(bill.personalData);
                        temp.forEach((item) => {
                            if (item.id === id) {
                                amount += convertNumber(item.amount);
                            }
                        });
                    }
                });
                return {
                    id,
                    name: peoples.find((people) => people.id === id).name,
                    amount: amount,
                };
            });

            setData(result);
        } catch (err) {
            console.error(err);
        } finally {
            hideLoading();
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    return (
        <>
            <div className="flex justify-between">
                <h1 className="font-bold text-xl">{statement.title}</h1>
                <p className="font-bold text-lg text-green-500">
                    {handleCurrencyInput(statement.total)} VNĐ
                </p>
            </div>

            <ul className="w-[500px]">
                {data.map((item, index) => (
                    <li
                        key={item.id}
                        className={`pb-3 sm:pb-4 ${
                            index !== data.length - 1
                                ? "border-b border-gray-200"
                                : ""
                        } mt-5`}
                    >
                        <div className="flex items-center space-x-4 rtl:space-x-reverse">
                            <div className="flex-shrink-0">
                                <img
                                    className="w-8 h-8 rounded-full"
                                    src={getImage(item.name.toLowerCase())}
                                    alt="Neil image"
                                />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium dark:text-gray-900 truncate text-white">
                                    {item.name}
                                </p>
                                <p className="text-sm text-gray-500 truncate dark:text-gray-400">
                                    {item.name}@RICE.com
                                </p>
                            </div>
                            <div className="inline-flex items-center text-base font-semibold dark:text-gray-900 text-white">
                                {handleCurrencyInput(item.amount.toString())}{" "}
                                VNĐ
                            </div>
                        </div>
                    </li>
                ))}
            </ul>
        </>
    );
}

export default StatementDetail;
