"use client";

import { IoCloseOutline } from "react-icons/io5";
import { FaStar } from "react-icons/fa";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import ClientAreaHeader from "./Header";
import ReactQueryClientProvider from "@/components/Providers/ReactQueryProvider";
import { usePathname } from "next/navigation";
import ClientAreaSidebar from "./Sidebar";
import { useSelector } from "react-redux";
import { useState } from "react";
import CreateTestimonial from "./rateus/page";

const ClientAreaLayout = ({ children }) => {
  const pathname = usePathname();
  const clientSidebar = useSelector((state) => state.rtkreducer.clientSidebar);
  const [showRateUsBtn, setRateUsBtn] = useState(true);
  const hideHeader = pathname === "/clientarea/setupwizard";
  const hideSidebar = pathname === "/clientarea/setupwizard";
  const [showRateUsDialog, setShowRateUsDialog] = useState(false);

  return (
    <div className="w-full">
      <ReactQueryClientProvider>
        <div>
          {/* Sidebar */}
          <div
            className={`w-full md:flex hidden ${hideSidebar ? "hidden" : ""}`}
          >
            {!hideSidebar && <ClientAreaSidebar />}
          </div>

          {/* Main Content Area */}
          <div
            className={`w-full transition-all duration-300 ${
              clientSidebar ? "md:pl-[235px]" : "md:pl-[75px]"
            }`}
          >
            {/* Header */}
            {!hideHeader && <ClientAreaHeader />}

            {/* Children */}
            {children}
          </div>
        </div>

        {/* Enhanced Floating Rate Us Button */}
        {showRateUsBtn && (
          <div className="fixed bottom-6 right-6 z-50 flex items-center rounded-xl overflow-hidden shadow-2xl bg-white dark:bg-gray-800 dark:border-none border border-gray-100 hover:shadow-3xl dark:hover:shadow-2xl dark:shadow-gray-900/50 transition-all duration-300 hover:scale-105">
            <Button
              onClick={() => setShowRateUsDialog(true)}
              variant="ghost"
              className="rounded-none rounded-l-xl border-r border-gray-100 dark:border-gray-700 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 dark:from-blue-600 dark:to-purple-700 text-white hover:from-blue-600 hover:to-purple-700 dark:hover:from-blue-700 dark:hover:to-purple-800 hover:bg-transparent font-medium flex items-center gap-2 transition-all duration-300"
            >
              <FaStar className="w-4 h-4 text-yellow-300 dark:text-yellow-400" />
              Rate Us
            </Button>
            <Button
              onClick={() => setRateUsBtn(false)}
              variant="ghost"
              className="rounded-none rounded-r-xl px-3 py-3 hover:bg-red-50 dark:hover:bg-red-900/20 text-gray-500 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-400 transition-all duration-200"
            >
              <IoCloseOutline className="w-5 h-5" />
            </Button>
          </div>
        )}

        {/* Enhanced Alert Dialog */}
        <AlertDialog open={showRateUsDialog} onOpenChange={setShowRateUsDialog}>
          <AlertDialogContent className="max-w-2xl w-full mx-4 rounded-2xl border-0 shadow-2xl dark:shadow-gray-900/50 bg-gradient-to-br from-white via-gray-50 to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-800 p-0 overflow-hidden">
            {/* Enhanced Header with Gradient */}
            <div className="bg-gradient-to-r flex justify-between items-center from-blue-500 to-purple-600 dark:from-blue-600 dark:to-purple-700 p-6 relative">
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-2">
                  <div className="bg-white/20 dark:bg-black/20 rounded-full p-3">
                    <FaStar className="w-6 h-6 text-yellow-300 dark:text-yellow-400" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white">
                      Share Your Experience
                    </h2>
                    <p className="text-white/90 dark:text-white/80 text-sm">
                      Help us improve by sharing your feedback
                    </p>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setShowRateUsDialog(false)}
                className="top-4 right-4 text-white/80 hover:text-white hover:bg-white/20 dark:hover:bg-black/20 rounded-full p-2 transition-all duration-200 z-10"
              >
                <IoCloseOutline className="w-6 h-6" />
              </button>
            </div>

            {/* Content Area with Enhanced Styling */}
            <AlertDialogHeader className="p-0">
              <AlertDialogDescription className="p-0">
                <div className="p-6 bg-white dark:bg-gray-900">
                  <CreateTestimonial />
                </div>
              </AlertDialogDescription>
            </AlertDialogHeader>
          </AlertDialogContent>
        </AlertDialog>
      </ReactQueryClientProvider>
    </div>
  );
};

export default ClientAreaLayout;
