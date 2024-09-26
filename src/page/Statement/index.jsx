import { useLoaderData, useRevalidator } from "react-router-dom";
import Statement from "../../components/Statement/List";

function StatementPage() {
    const data = useLoaderData();
    const revalidator = useRevalidator();
    return <Statement statements={data[0]} peoples={data[1]} revalidator={revalidator} />;
}

export default StatementPage;
