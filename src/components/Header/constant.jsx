const TABS = {
    data: [
        {
            id: 1,
            name: "Danh Sách Bill",
            href: "/bill",
        },
        {
            id: 2,
            name: "Danh Sách Sao Kê",
            href: "/statement",
        },
        {
            id: 3,
            name: "Thống kê",
            href: "/heh",
        },
    ],
    class: {
        active: "block py-2 pr-4 pl-3 text-white rounded bg-primary-700 lg:bg-transparent lg:text-primary-700 lg:p-0 dark:text-white",
        inactice:
            "block py-2 pr-4 pl-3 text-gray-700 border-b border-gray-100 hover:bg-gray-50 lg:hover:bg-transparent lg:border-0 lg:hover:text-primary-700 lg:p-0 dark:text-gray-400 lg:dark:hover:text-white dark:hover:bg-gray-700 dark:hover:text-white lg:dark:hover:bg-transparent dark:border-gray-700",
    },
};

export { TABS };
