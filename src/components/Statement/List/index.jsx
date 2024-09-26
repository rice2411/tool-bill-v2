import { useState } from "react";
import Input from "../../../small-components/Input";
import { convertNumber, handleCurrencyInput } from "../../../utils";
import StatementDetail from "../Detail";
import Modal from "../../../small-components/Modal";
import { toast } from "react-toastify";
import {
    deleteDocuments,
    getDocumentById,
    updateDocuments,
} from "../../../service/firebase";
import { BILLIARDS, DEFAULT_MESS, OTHER } from "../../Bill/constant";

function Statement({ statements, peoples, revalidator }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedStatement, setSelectedStatement] = useState(null);
    const [searchContent, setSearchContent] = useState("");

    const handleOpenModal = (statement) => {
        setIsModalOpen(true);
        setSelectedStatement(statement);
    };

    const handleClostModal = () => {
        setIsModalOpen(false);
    };

    const handleRevertStatement = async (statement) => {
        const confirmResult = confirm("Có muốn hủy sao kê này không");
        if (confirmResult) {
            await deleteDocuments("statements", statement.id);

            const bills = await Promise.all(
                statement.billsId.map((id) => getDocumentById("bills", id))
            );

            const peoplesUpdate = peoples
                .filter((people) =>
                    bills.some(
                        ({ peoples: billPeoples, personalData }) =>
                            billPeoples?.includes(people.id) ||
                            personalData?.includes(people.id)
                    )
                )
                .map((people) => {
                    bills.forEach((bill) => {
                        if (
                            bill.subtitle === BILLIARDS &&
                            bill.peoples.includes(people.id)
                        ) {
                            people.amount -=
                                Number(bill.total) /
                                bill.peoples.split(",").length;
                        } else if (bill.subtitle === OTHER) {
                            const personalData = JSON.parse(
                                bill.personalData || "[]"
                            );
                            personalData.forEach((data) => {
                                if (data.id === people.id) {
                                    people.amount -= convertNumber(data.amount);
                                }
                            });
                        }
                    });
                    return updateDocuments("users", people);
                });

            const billsUpdate = bills.map((bill) => {
                bill.status = 0;
                return updateDocuments("bills", bill);
            });
            await Promise.all([...billsUpdate, ...peoplesUpdate]);
            toast.success(DEFAULT_MESS);
            revalidator.revalidate();
        } else {
            toast.error("Coi chừng bấm lộn");
        }
    };

    return (
        <>
            <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
                {/* ACTIONS KHÁC */}
                <div className="flex items-baseline justify-between flex-column flex-wrap md:flex-row space-y-4 md:space-y-0 pb-4 bg-white dark:bg-gray-900">
                    <div className="relative">
                        <div className="absolute inset-y-0 rtl:inset-r-0 start-0 flex items-center ps-3 pointer-events-none">
                            <svg
                                className="w-4 h-4 text-gray-500 dark:text-gray-400"
                                aria-hidden="true"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 20 20"
                            >
                                <path
                                    stroke="currentColor"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                                />
                            </svg>
                        </div>
                        <Input
                            type="text"
                            id="table-search-users"
                            className=" block p-2 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg w-[280px] bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-100 dark:focus:border-blue-100"
                            placeholder="Tìm kiếm theo tên, người tạo, ngày "
                            onChange={(e) => {
                                const text = e.target.value;
                                setSearchContent(text.toLowerCase());
                            }}
                        />
                    </div>
                </div>

                {/* DANH SÁCH SAO KÊ */}
                <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                        <tr>
                            <th scope="col" className="px-6 py-3">
                                STT
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Đơn sao kê
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Giá trị
                            </th>

                            <th scope="col" className="px-6 py-3">
                                Hành động
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {statements
                            .filter(
                                (statement) =>
                                    statement.title
                                        .toLowerCase()
                                        .includes(searchContent) ||
                                    statement.total
                                        .toLowerCase()
                                        .includes(searchContent) ||
                                    statement.creator
                                        .toLowerCase()
                                        .includes(searchContent)
                            )
                            .map((statement, index) => (
                                <tr
                                    key={statement.id}
                                    className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 cursor-pointer"
                                    onClick={(e) => {
                                        if (
                                            e.target.tagName !== "A" &&
                                            e.target.tagName !== "INPUT"
                                        ) {
                                            handleOpenModal(statement);
                                        }
                                    }}
                                >
                                    <td className="px-6 py-4 text-center">
                                        {index + 1}
                                    </td>
                                    <th
                                        scope="row"
                                        className="flex items-center px-6 py-4 text-gray-900 whitespace-nowrap dark:text-white"
                                    >
                                        <div className="">
                                            <div className="text-base font-semibold">
                                                {statement.title}
                                            </div>
                                            <div className="font-normal text-gray-500">
                                                {statement.creator}
                                            </div>
                                        </div>
                                    </th>
                                    <td className="px-6 py-4">
                                        {handleCurrencyInput(statement.total)}{" "}
                                        VNĐ
                                    </td>
                                    {/* <td className="px-6 py-4">
                                    <div className="flex items-center ">
                                        <div
                                            className={`h-2.5 w-2.5 rounded-full ${
                                                bill.status
                                                    ? "bg-green-500"
                                                    : "bg-red-500"
                                            } me-2`}
                                        />
                                        {bill.status
                                            ? "Đã sao kê"
                                            : "Chưa sao kê"}
                                    </div>
                                </td> */}
                                    <td className="px-6 py-4 text-center">
                                        <a
                                            onClick={() => {
                                                handleRevertStatement(
                                                    statement
                                                );
                                            }}
                                            href="#"
                                            className="font-medium text-red-600 dark:text-red-500 hover:underline"
                                        >
                                            Hủy sao kê
                                        </a>
                                    </td>
                                </tr>
                            ))}
                    </tbody>
                </table>
            </div>
            <Modal isOpen={isModalOpen} onClose={handleClostModal}>
                <StatementDetail
                    statement={selectedStatement}
                    peoples={peoples}
                />
            </Modal>
        </>
    );
}

export default Statement;
