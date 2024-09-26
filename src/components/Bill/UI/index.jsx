import React from 'react';
import { handleCurrencyInput } from '../../../utils';
import { BILLIARDS, DEFAULT_SUBTITLE, OTHER } from '../constant';

const Bill = ({ billData, peoples }) => {
    return (
        <div className=" mx-auto bg-white p-12 min-w-[450px]  ">
            {/* Title */}
            <h1 className="text-2xl font-bold text-center mb-4">Hóa đơn thanh toán</h1>

            {/* Subtitle */}
            <h2 className="text-xl text-center mb-4">{DEFAULT_SUBTITLE.find(item => item.value === billData.subtitle).text || BILLIARDS}</h2>

            {/* Date and Bill Number */}
            <div className="flex justify-between mb-2">
                <span>Ngày hệ thống: {billData.createdDate}</span>
                <span>Giờ hệ thống: {billData.createdHour}</span>
            </div>

            {/* Cashier and Bill Time */}
            <div className="flex justify-between mb-2">
                <span>Thu Ngân: {billData.cashier}</span>
                <span>Số phiếu: {billData.billNumber}</span>
            </div>


            {/* Ngày hệ thống */}
            <div className="flex justify-between mb-2">
                <span>Ngày tạo: {billData.updatedDate}</span>
                <span>Giờ tạo bill: {billData.updateHour}</span>
            </div>


            {/* Table 1: Time and Prices */}
            {billData.subtitle === BILLIARDS && <table className="w-full mb-4 text-center">
                <thead className='border-b border-gray-300'>
                    <tr>
                        <th>Vào</th>
                        <th>Ra</th>
                        <th>T. Gian</th>
                        <th>Đ. Giá</th>
                        <th>T. Tiền</th>
                    </tr>
                </thead>
                <tbody className='border-b border-dotted border-gray-300'>
                    <tr>
                        <td>{billData.timeIn}</td>
                        <td>{billData.timeOut}</td>
                        <td>{billData.exactDate}</td>
                        <td>{billData.pricePerHour}</td>
                        <td>{handleCurrencyInput(billData.total)}</td>
                    </tr>
                </tbody>
            </table>}

            {/* Table 2: Items */}
            {billData.subtitle === OTHER && <table className="w-full mb-4 text-center">
                <thead className='border-b border-gray-300'>
                    <tr>
                        <th>Mặt Hàng</th>
                        <th>ĐVT</th>
                        <th>SL</th>
                        <th>Giá</th>
                        <th>T. Tiền</th>
                    </tr>
                </thead>
                <tbody className='border-b border-dotted border-gray-300'>
                    {JSON.parse(billData.personalData).map((item) => (
                        <tr key={item.id}>
                            <td>{peoples.find((people) => people.id === item.id)?.name}</td>
                            <td>Người</td>
                            <td>1</td>
                            <td>{handleCurrencyInput(item.amount || '')}</td>
                            <td>{handleCurrencyInput(item.amount || '')}</td>
                        </tr>
                    ))}
                </tbody>
            </table>}

            {/* Người tham gia */}
            {billData.subtitle === BILLIARDS && <div className="flex justify-between tl mb-2 border-b border-gray-300">
                <span className="">Người tham gia: </span>
                <span>
                    {billData.peoples
                        && peoples
                            .filter(item => billData.peoples.includes(item.id))
                            .map(item => item.name)
                            .join(", ")
                    }
                </span>
            </div>}

            {/* Ghi chú */}
            <div className="flex justify-between tl mb-2 border-b border-gray-300">
                <span className="">Ghi chú: </span>
                <span>
                    {billData.note}
                </span>
            </div>

            {/* Tổng tiền */}
            {billData.subtitle === BILLIARDS && <div className="flex justify-between tl mb-2">
                <span className="">Tiền giờ: </span>
                <span>{handleCurrencyInput(billData.total)}</span>
            </div>
            }
            {billData.subtitle === OTHER && <div className="flex justify-between tl mb-2 border-b border-gray-300">
                <span className="">Tổng SL: </span>
                <span>{handleCurrencyInput(billData.total)}</span>
            </div>
            }

            <div className="flex justify-between text-xl font-bold">
                <span className="">Tổng: </span>
                <span>{handleCurrencyInput(billData.total)}</span>
            </div>
        </div>
    );
};

export default Bill;
