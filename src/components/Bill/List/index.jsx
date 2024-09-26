import { useEffect, useRef, useState } from "react";
import { BILLIARDS, DEFAULT_MESS, DEFAULT_SUBTITLE, OTHER } from "../constant";
import BillForm from "../Form";
import Modal from "../../../small-components/Modal";
import Input from "../../../small-components/Input";
import {
    createDocuments,
    deleteDocuments,
    updateDocuments,
} from "../../../service/firebase";
import { toast } from "react-toastify";
import { useLoading } from "../../../context/loading";
import { convertNumber } from "../../../utils";

function ListBill({ bills, peoples, revalidator }) {
    const { showLoading, hideLoading } = useLoading();
    const ref = useRef(null);
    const [isOpen, setIsOpen] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalType, setModalType] = useState("create");
    const [editBill, setEditBill] = useState(null);
    const [searchContent, setSearchContent] = useState("");
    const [selectedBill, setSelectedBill] = useState([]);

    const handleCreateStatement = async () => {
        if (!selectedBill.length) {
            toast.error("Làm ơn chọn ít nhất 1 bill");
            return;
        }

        showLoading();

        try {
            const _bills = bills.filter((bill) =>
                selectedBill.includes(bill.id)
            );

            // Tạo payload sao kê
            const payload = {
                title: `Sao kê ngày ${new Date()
                    .toLocaleString("vi-VN", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                    })
                    .replace(",", "")}`,
                total: _bills
                    .reduce(
                        (total, { total: billTotal }) =>
                            total + convertNumber(billTotal),
                        0
                    )
                    .toString(),
                creator: [
                    ...new Set(_bills.map(({ cashier }) => cashier)),
                ].join(","),
                billsId: selectedBill,
            };

            // Tạo sao kê
            await createDocuments("statements", payload);

            // Cập nhật trạng thái của bills
            const billsUpdate = _bills.map((bill) => {
                bill.status = 1;
                return updateDocuments("bills", bill);
            });

            // Cập nhật số tiền cho mỗi người
            const peoplesUpdate = peoples
                .filter((people) =>
                    _bills.some(
                        ({ peoples: billPeoples, personalData }) =>
                            billPeoples?.includes(people.id) ||
                            personalData?.includes(people.id)
                    )
                )
                .map((people) => {
                    _bills.forEach((bill) => {
                        if (
                            bill.subtitle === BILLIARDS &&
                            bill.peoples.includes(people.id)
                        ) {
                            people.amount +=
                                Number(bill.total) /
                                bill.peoples.split(",").length;
                        } else if (bill.subtitle === OTHER) {
                            const personalData = JSON.parse(
                                bill.personalData || "[]"
                            );
                            personalData.forEach((data) => {
                                if (data.id === people.id) {
                                    people.amount += convertNumber(data.amount);
                                }
                            });
                        }
                    });
                    return updateDocuments("users", people);
                });

            // Thực hiện đồng thời các cập nhật
            await Promise.all([...billsUpdate, ...peoplesUpdate]);

            toast.success(DEFAULT_MESS);
            setIsOpen(false);
        } catch (error) {
            console.error("Error updating statement:", error);
            toast.error("Đã xảy ra lỗi khi tạo sao kê");
        } finally {
            hideLoading();
            revalidator.revalidate();
        }
    };

    const handleSelectBill = (id) => {
        const temp = [...selectedBill];
        const billIndex = temp.indexOf(id);
        if (billIndex > -1) {
            temp.splice(billIndex, 1);
        } else {
            temp.push(id);
        }
        setSelectedBill(temp);
    };

    const handleSelectAllBill = () => {
        const temp = [...selectedBill];

        if (temp.length === bills.length) {
            setSelectedBill([]);
        } else {
            bills.forEach((bill) => {
                const billIndex = temp.indexOf(bill.id);
                if (billIndex > -1) {
                } else {
                    if (!bill.status) temp.push(bill.id);
                }
            });
            setSelectedBill(temp);
        }
    };

    const handleDeleteBill = async (id) => {
        const result = confirm("Bạn có muốn xóa bill này");
        if (result) {
            await deleteDocuments("bills", id);
            toast.success("Xóa thành công");
            revalidator.revalidate();
            return;
        }
        toast.error("Đã có cái nòn gì đó xảy ra");
    };

    const openModal = (type, _bills = null) => {
        setIsModalOpen(true);
        setIsOpen(false);
        setModalType(type);
        setEditBill(_bills);
    };
    const closeModal = () => setIsModalOpen(false);

    useEffect(() => {
        function handleClickOutside(event) {
            if (ref.current && !ref.current.contains(event.target)) {
                if (event.target.id.includes("options")) {
                    return;
                }
                setIsOpen(false);
                return;
            }
        }

        // Add event listener for clicks
        document.addEventListener("mousedown", handleClickOutside);

        // Clean up the event listener when the component unmounts
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [ref]);

    return (
        <>
            <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
                {/* ACTIONS KHÁC */}
                <div className="flex items-baseline justify-between flex-column flex-wrap md:flex-row space-y-4 md:space-y-0 pb-4 bg-white dark:bg-gray-900">
                    <div>
                        <button
                            id="dropdownActionButton"
                            _bills-dropdown-toggle="dropdownAction"
                            className="inline-flex items-center text-gray-500 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 font-medium rounded-lg text-sm px-3 py-1.5 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700"
                            type="button"
                            onClick={() => {
                                setIsOpen((state) => !state);
                            }}
                            ref={ref}
                        >
                            <span className="sr-only">Action button</span>
                            Hành động
                            <svg
                                className="w-2.5 h-2.5 ms-2.5"
                                aria-hidden="true"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 10 6"
                            >
                                <path
                                    stroke="currentColor"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="m1 1 4 4 4-4"
                                />
                            </svg>
                        </button>
                        {/* Dropdown menu */}
                        <div
                            id="dropdownAction"
                            className={`z-10 absolute ${
                                !isOpen && "hidden"
                            } bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700 dark:divide-gray-600`}
                        >
                            <ul
                                className="py-1 text-sm text-gray-700 dark:text-gray-200"
                                aria-labelledby="dropdownActionButton"
                            >
                                <li
                                    onClick={() => {
                                        openModal("create");
                                    }}
                                >
                                    <a
                                        id="options-1"
                                        href="#"
                                        className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                                    >
                                        Tạo bill
                                    </a>
                                </li>
                                <li>
                                    <a
                                        id="options-2"
                                        onClick={handleCreateStatement}
                                        href="#"
                                        className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                                    >
                                        Lên sao kê
                                    </a>
                                </li>
                            </ul>
                            <div className="py-1">
                                <a
                                    id="options-3"
                                    href="#"
                                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white"
                                >
                                    Xuất
                                </a>
                            </div>
                        </div>
                    </div>
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

                {/* DANH SÁCH BILL */}
                <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                        <tr>
                            <th scope="col" className="p-4">
                                <div className="flex items-center">
                                    <input
                                        onChange={handleSelectAllBill}
                                        checked={
                                            bills.length === selectedBill.length
                                        }
                                        id="checkbox-all-search"
                                        type="checkbox"
                                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                                    />
                                    <label
                                        htmlFor="checkbox-all-search"
                                        className="sr-only"
                                    >
                                        checkbox
                                    </label>
                                </div>
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Tên Bill
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Người tạo
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Trạng Thái
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Hành động
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {bills
                            .filter(
                                (bill) =>
                                    DEFAULT_SUBTITLE.find(
                                        (item) => item.id === bill.subtitle
                                    )
                                        .text.toLowerCase()
                                        .includes(searchContent) ||
                                    bill.cashier
                                        .toLowerCase()
                                        .includes(searchContent) ||
                                    bill.exactDate
                                        .toLowerCase()
                                        .includes(searchContent)
                            )
                            .map((bill) => (
                                <tr
                                    key={bill.id}
                                    className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 cursor-pointer"
                                    onClick={(e) => {
                                        if (
                                            e.target.tagName !== "A" &&
                                            e.target.tagName !== "INPUT"
                                        ) {
                                            openModal("edit", bill);
                                        }
                                    }}
                                >
                                    <td className="w-4 p-4">
                                        <div className="flex items-center">
                                            <input
                                                disabled={bill.status}
                                                onChange={() => {
                                                    handleSelectBill(bill.id);
                                                }}
                                                checked={selectedBill.includes(
                                                    bill.id
                                                )}
                                                id="checkbox-table-search-1"
                                                type="checkbox"
                                                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                                            />
                                            <label
                                                htmlFor="checkbox-table-search-1"
                                                className="sr-only"
                                            >
                                                checkbox
                                            </label>
                                        </div>
                                    </td>
                                    <th
                                        scope="row"
                                        className="flex items-center px-6 py-4 text-gray-900 whitespace-nowrap dark:text-white"
                                    >
                                        <div className="">
                                            <div className="text-base font-semibold">
                                                {
                                                    DEFAULT_SUBTITLE.find(
                                                        (item) =>
                                                            item.id ===
                                                            bill.subtitle
                                                    ).text
                                                }
                                            </div>
                                            <div className="font-normal text-gray-500">
                                                {bill.exactDate}
                                            </div>
                                        </div>
                                    </th>
                                    <td className="px-6 py-4">
                                        {bill.cashier}
                                    </td>
                                    <td className="px-6 py-4">
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
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <a
                                            href="#"
                                            onClick={() => {
                                                if (bill.status) {
                                                    toast.error("Đừng lì nữa");
                                                    return;
                                                }
                                                handleDeleteBill(bill.id);
                                            }}
                                            className="font-medium text-red-600 dark:text-red-500 hover:underline"
                                        >
                                            {bill.status
                                                ? "Bill đã sao kê không thể xóa"
                                                : "Xóa"}
                                        </a>
                                    </td>
                                </tr>
                            ))}
                    </tbody>
                </table>
            </div>
            <Modal isOpen={isModalOpen} onClose={closeModal}>
                <BillForm
                    peoples={peoples}
                    type={modalType}
                    data={editBill}
                    revalidator={revalidator}
                />
            </Modal>
        </>
    );
}

export default ListBill;
