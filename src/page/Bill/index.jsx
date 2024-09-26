import { useState } from 'react'
import { useFetcher, useLoaderData, useRevalidator } from 'react-router-dom';
import ListBill from '../../components/Bill/List';

function BillPage() {
    const data = useLoaderData();
    const revalidator = useRevalidator();

    const peoples = data[0];
    const bills = data[1];
    return (
        // <BillForm peoples={peoples} />
        <ListBill bills={bills} peoples={peoples} revalidator={revalidator}/>
    )
}

export default BillPage
