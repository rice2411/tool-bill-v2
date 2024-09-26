import { initializeApp } from "firebase/app";
import {
    addDoc,
    collection,
    deleteDoc,
    doc,
    getDoc,
    getDocs,
    getFirestore,
    updateDoc,
} from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyATBFpa255YOHnXSeFsUeOn_h3lbJR6Yrc",
    authDomain: "fir-js-fc0aa.firebaseapp.com",
    projectId: "fir-js-fc0aa",
    storageBucket: "fir-js-fc0aa.appspot.com",
    messagingSenderId: "266360330821",
    appId: "1:266360330821:web:8b4265aacdbcf91905212c",
    measurementId: "G-6XPV1100TP",
};

const app = initializeApp(firebaseConfig);

const db = getFirestore(app);

const getDocumentById = async (documentName, id) => {
    const docRef = doc(db, documentName, id);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
        return docSnap.data(); // trả về data của document
    } else {
        return null;
    }
};

const getDocuments = async (documentName) => {
    const querySnapshot = await getDocs(collection(db, documentName));
    const docsData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
    }));
    return docsData;
};

const createDocuments = async (documentName, data) => {
    return addDoc(collection(db, documentName), data);
};

const updateDocuments = async (documentName, data) => {
    const ref = doc(db, documentName, data.id);
    return updateDoc(ref, data);
};

const deleteDocuments = async (documentName, id) => {
    const ref = doc(db, documentName, id);
    return deleteDoc(ref);
};
export {
    db,
    getDocuments,
    createDocuments,
    updateDocuments,
    deleteDocuments,
    getDocumentById,
};
