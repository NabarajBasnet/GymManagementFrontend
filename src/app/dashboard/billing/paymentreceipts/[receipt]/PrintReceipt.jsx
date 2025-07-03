'use client';

import Loader from "@/components/Loader/Loader";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";

const ReceiptDetails = ({ receiptId }) => {

    const getReceiptDetails = async () => {
        try {
            const response = await fetch(`http://localhost:3000/api/receipt/V2/${receiptId}`)
            const resBody = await response.json();
            return resBody;
        } catch (error) {
            console.log("Error: ", error);
            toast.error(error.message)
        }
    }

    const { data, isLoading } = useQuery({
        queryKey: ['receipt'],
        queryFn: getReceiptDetails,
        enabled: !!receiptId
    })
    const { receipt } = data || {};
    console.log('Receipt: ', receipt);

    return (
        <div>
                    <Loader />

            {
                isLoading ? (
                    <Loader />
                ) : (
                    <div>
                    </div>
                )
            }
        </div>
    )
}

export default ReceiptDetails;
