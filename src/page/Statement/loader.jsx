import { getDocuments } from "../../service/firebase";

export const statementLoader = async () => {
    const request = [getDocuments("statements"), getDocuments("users")];
    const response = await Promise.all(request);

    return response;
};
