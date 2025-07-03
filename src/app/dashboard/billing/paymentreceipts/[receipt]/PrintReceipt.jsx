"use client";

import { MdOutlineLocalPrintshop, MdDownload } from "react-icons/md";
import Link from "next/link"
import {
    Breadcrumb,
    BreadcrumbEllipsis,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button";
import Loader from "@/components/Loader/Loader";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { useRef, useState } from "react";
import { format } from 'date-fns';
import { useReactToPrint } from "react-to-print";
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";

const ReceiptDetails = ({ receiptId }) => {
    const contentRef = useRef(null);
    const reactToPrintFn = useReactToPrint({ contentRef });
    const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
    const [showPDFAlert, setShowPDFAlert] = useState(false);

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

    const generatePDF = async () => {
        setIsGeneratingPDF(true);
        try {
            const element = contentRef.current;
            const canvas = await html2canvas(element, {
                scale: 2,
                useCORS: true,
                logging: false,
                allowTaint: true
            });

            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF('p', 'mm', 'a4');
            const imgProps = pdf.getImageProperties(imgData);
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

            pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
            pdf.save(`receipt_${receipt.receiptNo}.pdf`);
            setShowPDFAlert(true);
        } catch (error) {
            toast.error("Failed to generate PDF");
            console.error("PDF generation error:", error);
        } finally {
            setIsGeneratingPDF(false);
        }
    };

    if (isLoading) return <Loader />;
    if (!receipt) return <div className="p-8 text-center">No receipt data found</div>;

    const formatDate = (dateString) => {
        try {
            return format(new Date(dateString), 'dd MMMM yyyy');
        } catch {
            return dateString;
        }
    };

    return (
        <div className='w-full px-4 py-6 max-w-7xl mx-auto'>
            <AlertDialog open={showPDFAlert} onOpenChange={setShowPDFAlert}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>PDF Download Complete</AlertDialogTitle>
                        <AlertDialogDescription>
                            The receipt has been successfully downloaded as a PDF file.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogAction>Continue</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            <header className="flex flex-col gap-4 mb-8">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <Breadcrumb>
                        <BreadcrumbList className="flex-wrap">
                            <BreadcrumbItem>
                                <BreadcrumbLink asChild>
                                    <Link
                                        href="/"
                                        className="text-primary hover:underline hover:text-primary/90 transition-colors text-sm md:text-base"
                                        aria-label="Go to home page"
                                    >
                                        Home
                                    </Link>
                                </BreadcrumbLink>
                            </BreadcrumbItem>

                            <BreadcrumbSeparator className="text-muted-foreground" />

                            <BreadcrumbItem>
                                <BreadcrumbLink asChild>
                                    <Link
                                        href="/receipts"
                                        className="text-primary hover:underline hover:text-primary/90 transition-colors text-sm md:text-base"
                                    >
                                        Receipts
                                    </Link>
                                </BreadcrumbLink>
                            </BreadcrumbItem>

                            <BreadcrumbSeparator className="text-muted-foreground" />

                            <BreadcrumbItem>
                                <BreadcrumbPage className="font-medium text-foreground text-sm md:text-base">
                                    {receipt.receiptNo}
                                </BreadcrumbPage>
                            </BreadcrumbItem>
                        </BreadcrumbList>
                    </Breadcrumb>

                    <div className="flex gap-2 flex-wrap">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => reactToPrintFn()}
                            aria-label="Print this page"
                            className="flex-1 md:flex-none dark:bg-gray-800 dark:border-none text-primary px-4"
                        >
                            <MdOutlineLocalPrintshop className="mr-2 h-4 w-4" />
                            <span className="sr-only md:not-sr-only">Print</span>
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={generatePDF}
                            disabled={isGeneratingPDF}
                            aria-label="Download as PDF"
                            className="flex-1 md:flex-none dark:bg-gray-800 dark:border-none text-primary px-4"
                        >
                            <MdDownload className="mr-2 h-4 w-4" />
                            {isGeneratingPDF ? 'Generating...' : <span className="sr-only md:not-sr-only">PDF</span>}
                        </Button>
                    </div>
                </div>

                <h1 className="text-2xl md:text-3xl text-primary font-bold tracking-tight">
                    Receipt Details
                </h1>
            </header>

            <div className="bg-white dark:bg-gray-900 rounded-lg shadow-sm border dark:border-none">
                <div ref={contentRef} className="p-6 md:p-8 max-w-3xl rounded-md mx-auto bg-white dark:bg-gray-800 print:shadow-none print:border-0">
                    {/* Header */}
                    <div className="text-center mb-6 md:mb-8">
                        <div className="flex justify-center mb-3 md:mb-4">
                            <h1 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">
                                {receipt.organization?.name}
                            </h1>
                        </div>
                        <h1 className="text-xl md:text-2xl font-bold text-gray-800 dark:text-gray-200">OFFICIAL RECEIPT</h1>
                        <p className="text-xs md:text-sm text-gray-600 dark:text-gray-400">{receipt.organization?.name}</p>
                        <p className="text-xs md:text-sm text-gray-600 dark:text-gray-400">{receipt.organizationBranch?.orgBranchName}</p>
                    </div>

                    {/* Receipt Info */}
                    <div className="flex flex-col md:flex-row justify-between mb-6 md:mb-8 gap-4">
                        <div className="space-y-1">
                            <p className="font-semibold text-sm md:text-base text-primary">Receipt No: <span className="font-normal">{receipt.receiptNo}</span></p>
                            <p className="font-semibold text-sm md:text-base text-primary">Date: <span className="font-normal">{formatDate(receipt.createdAt)}</span></p>
                        </div>
                        <div className="space-y-1 text-left md:text-right">
                            <p className="font-semibold text-sm md:text-base text-primary">Amount: <span className="font-normal">Rs. {receipt.receivedAmount?.toLocaleString()}</span></p>
                            <p className="font-semibold text-sm md:text-base text-primary">Payment Status: <span className="font-normal text-green-600 dark:text-green-400">Paid</span></p>
                        </div>
                    </div>

                    {/* Payment Received Statement */}
                    <div className="mb-6 md:mb-8 p-3 md:p-4 bg-gray-50 dark:bg-gray-700 rounded">
                        <p className="text-gray-700 dark:text-gray-300 text-sm md:text-base">
                            We at <span className="font-semibold">{receipt.organization?.name}</span>, {receipt.organizationBranch?.orgBranchName},
                            have received a total of <span className="font-semibold">Rs. {receipt.receivedAmount?.toLocaleString()}</span> from
                            {receipt.customer ? ` ${receipt.customer.fullName}` : ' the customer'} on {formatDate(receipt.createdAt)} towards
                            {receipt.membership?.map((item, index) => (
                                <span key={index}>
                                    {index > 0 && index === receipt.membership.length - 1 ? ' and ' : index > 0 ? ', ' : ' '}
                                    <span className="font-semibold">{item}</span>
                                </span>
                            ))}.
                        </p>
                    </div>

                    {/* Items Table */}
                    <div className="mb-6 md:mb-8">
                        <div className="overflow-x-auto">
                            <table className="min-w-full border-collapse">
                                <thead>
                                    <tr className="border-b-2 border-gray-200 dark:border-gray-600">
                                        <th className="text-left py-2 px-3 md:px-4 font-semibold text-gray-700 dark:text-gray-300 text-sm md:text-base text-primary">Description</th>
                                        <th className="text-right py-2 px-3 md:px-4 font-semibold text-gray-700 dark:text-gray-300 text-sm md:text-base text-primary">Quantity</th>
                                        <th className="text-right py-2 px-3 md:px-4 font-semibold text-gray-700 dark:text-gray-300 text-sm md:text-base text-primary">Rate (Rs.)</th>
                                        <th className="text-right py-2 px-3 md:px-4 font-semibold text-gray-700 dark:text-gray-300 text-sm md:text-base text-primary">Amount (Rs.)</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {receipt.itemId && (
                                        <tr className="border-b border-gray-100 dark:border-gray-700">
                                            <td className="py-2 md:py-3 px-3 md:px-4 text-sm md:text-base text-primary">{receipt.itemId.planName}</td>
                                            <td className="py-2 md:py-3 px-3 md:px-4 text-right text-sm md:text-base text-primary">1</td>
                                            <td className="py-2 md:py-3 px-3 md:px-4 text-right text-sm md:text-base text-primary">{receipt.itemId.price?.toLocaleString()}</td>
                                            <td className="py-2 md:py-3 px-3 md:px-4 text-right text-sm md:text-base text-primary">{receipt.itemId.price?.toLocaleString()}</td>
                                        </tr>
                                    )}
                                    {receipt.receivedAmount > receipt.itemId?.price && (
                                        <tr className="border-b border-gray-100 dark:border-gray-700 text-primary">
                                            <td className="py-2 md:py-3 px-3 md:px-4 text-sm md:text-base text-primary">Admission Fee</td>
                                            <td className="py-2 md:py-3 px-3 md:px-4 text-right text-sm md:text-base text-primary">1</td>
                                            <td className="py-2 md:py-3 px-3 md:px-4 text-right text-sm md:text-base text-primary">{(receipt.receivedAmount - receipt.itemId?.price)?.toLocaleString()}</td>
                                            <td className="py-2 md:py-3 px-3 md:px-4 text-right text-sm md:text-base text-primary">{(receipt.receivedAmount - receipt.itemId?.price)?.toLocaleString()}</td>
                                        </tr>
                                    )}
                                </tbody>
                                <tfoot>
                                    <tr className="border-t-2 border-gray-200 dark:border-gray-600">
                                        <td colSpan="3" className="py-2 px-3 md:px-4 text-right font-semibold text-sm md:text-base text-primary">Total Amount:</td>
                                        <td className="py-2 px-3 md:px-4 text-right font-semibold text-sm md:text-base text-primary">Rs. {receipt.receivedAmount?.toLocaleString()}</td>
                                    </tr>
                                </tfoot>
                            </table>
                        </div>
                    </div>

                    {/* Additional Information */}
                    <div className="mb-6 md:mb-8">
                        <div className="mb-3 md:mb-4">
                            <p className="font-semibold text-sm md:text-base text-primary">Remarks:</p>
                            <p className="text-sm md:text-base text-primary">Paid in full. {receipt.itemId?.duration && `Valid for ${receipt.itemId.duration} days.`}</p>
                        </div>
                        {receipt.itemId?.timeRestriction && (
                            <div className="mb-3 md:mb-4">
                                <p className="font-semibold text-sm md:text-base text-primary">Access Hours:</p>
                                <p className="text-sm md:text-base text-primary">{receipt.itemId.timeRestriction.startTime} - {receipt.itemId.timeRestriction.endTime}</p>
                            </div>
                        )}
                    </div>

                    {/* Signatures */}
                    <div className="flex flex-col md:flex-row justify-between mt-8 md:mt-12 pt-4 border-t border-gray-200 dark:border-gray-600 gap-4 md:gap-0">
                        <div className="text-center">
                            <p className="mb-6 md:mb-8 border-b border-gray-400 w-full md:w-48 inline-block text-primary">Customer Signature</p>
                            <p className="text-xs md:text-sm text-gray-600 dark:text-gray-400 text-primary">Date: _________________</p>
                        </div>
                        <div className="text-center">
                            <p className="mb-6 md:mb-8 border-b border-gray-400 w-full md:w-48 inline-block text-primary">Authorized Signature</p>
                            <p className="text-xs md:text-sm text-gray-600 dark:text-gray-400 text-primary">Date: _________________</p>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="mt-6 md:mt-8 pt-4 border-t border-gray-200 dark:border-gray-600 text-center text-xs md:text-sm text-gray-500 dark:text-gray-400">
                        <p>{receipt.organization?.name} • {receipt.organizationBranch?.orgBranchAddress}</p>
                        <p>Tel: {receipt.organizationBranch?.orgBranchPhone} • Email: {receipt.organizationBranch?.orgBranchEmail}</p>
                        <p className="mt-1 md:mt-2">This is a computer generated receipt and does not require a physical signature.</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ReceiptDetails;