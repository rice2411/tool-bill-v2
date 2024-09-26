import { Outlet } from "react-router-dom";
import Header from "../components/Header";
import { ToastContainer } from "react-toastify";
import LoadingOverlay from "../components/LoadingOverlay";

function MainLayout() {
    return (
        <>
            <LoadingOverlay />
            <div className="flex flex-col  min-h-screen bg-white dark:bg-gray-900 ">
                <Header></Header>
                <div className="flex justify-center items-center mt-20 mx-10 ">
                    <Outlet></Outlet>
                </div>
            </div>
            <ToastContainer />
        </>
    );
}

export default MainLayout;
