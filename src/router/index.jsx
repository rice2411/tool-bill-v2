import { createBrowserRouter, Navigate, Outlet } from "react-router-dom";
import MainLayout from "../layout/main";
import BillPage from "../page/Bill";
import { billLoader } from "../page/Bill/loader";
import StatementPage from "../page/Statement";
import { statementLoader } from "../page/Statement/loader";
import { LoadingProvider } from "../context/loading";

export default createBrowserRouter([
    {
        element: (
            <LoadingProvider>
                <MainLayout />
            </LoadingProvider>
        ),
        path: "/",
        children: [
            {
                path: "/bill",
                element: <BillPage />,
                loader: billLoader,
            },
            {
                path: "/statement",
                element: <StatementPage />,
                loader: statementLoader,
            },
        ],
    },
    {
        path: "*",
        element: <Navigate to="/bill" replace />,
    },
]);
