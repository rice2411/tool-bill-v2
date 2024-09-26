import { getDocuments } from "../../service/firebase";

export const billLoader = async () => {
    const request = [getDocuments('users'), getDocuments('bills')];
    const respoonse = await Promise.all(request);

    return respoonse;
};