import ReceiptDetails from "./PrintReceipt";

const Receipt = async ({ params }) => {

    const { receipt } = await params;
    const receiptId = receipt;

    return (
        <ReceiptDetails receiptId={receiptId} />
    )
}

export default Receipt;
