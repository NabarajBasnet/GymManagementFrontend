'use client';

import { Button } from "@/components/ui/button";
import { CheckCircle2, Users, Calendar, UserPlus, GitBranch } from "lucide-react";
import { motion } from "framer-motion";

const ThirdStep = () => {
    return (
        <div className="space-y-4 text-center">
            {/* Header Section */}
            <div className="text-center pb-8">
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 200, damping: 15 }}
                    className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-r from-emerald-100 to-teal-100 dark:from-emerald-900/30 dark:to-teal-900/30 shadow-lg mb-6"
                >
                    <CheckCircle2 className="h-8 w-8 text-emerald-600 dark:text-emerald-400" />
                </motion.div>

                <h2 className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent mb-4">
                    You're All Set!
                </h2>
                <p className="text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
                    Your gym management system is ready to go. Let's start optimizing your fitness business.
                </p>
            </div>

            {/* Next Steps Card */}
            <div className="bg-gradient-to-r from-blue-50/50 to-indigo-50/50 dark:from-blue-950/20 dark:to-indigo-950/20 rounded-2xl p-8 border border-blue-100 dark:border-blue-900/30">
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                        <Users className="w-4 h-4 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white">Next Steps</h3>
                </div>

                <ul className="space-y-4">
                    <motion.li
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 }}
                        className="flex items-start p-4 bg-white dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700"
                    >
                        <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 text-white text-sm font-bold mr-3 mt-0.5">1</span>
                        <div className="text-left">
                            <h4 className="font-semibold text-slate-800 dark:text-slate-100">Add Your Staff</h4>
                            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Invite trainers and administrators to your team</p>
                        </div>
                    </motion.li>

                    <motion.li
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                        className="flex items-start p-4 bg-white dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700"
                    >
                        <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-white text-sm font-bold mr-3 mt-0.5">2</span>
                        <div className="text-left">
                            <h4 className="font-semibold text-slate-800 dark:text-slate-100">Set Up Classes & Schedules</h4>
                            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Create your fitness programs and timetables</p>
                        </div>
                    </motion.li>

                    <motion.li
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 }}
                        className="flex items-start p-4 bg-white dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700"
                    >
                        <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-sm font-bold mr-3 mt-0.5">3</span>
                        <div className="text-left">
                            <h4 className="font-semibold text-slate-800 dark:text-slate-100">Import or Add Members</h4>
                            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Bring your existing members or onboard new ones</p>
                        </div>
                    </motion.li>

                    <motion.li
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.4 }}
                        className="flex items-start p-4 bg-white dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700"
                    >
                        <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-r from-amber-500 to-orange-500 text-white text-sm font-bold mr-3 mt-0.5">4</span>
                        <div className="text-left">
                            <h4 className="font-semibold text-slate-800 dark:text-slate-100">Create Branches & Users</h4>
                            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Expand your gym network and manage locations</p>
                        </div>
                    </motion.li>
                </ul>
            </div>

            {/* Footer Section */}
            <div className="pt-6">
                <p className="text-sm text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/50 px-4 py-3 rounded-lg inline-block">
                    You can always change these settings later in your account preferences.
                </p>

                <div className="mt-4">
                    <Button
                        className="w-full h-14 text-base dark:text-gray-200 font-semibold rounded-lg shadow-lg transition-all duration-200 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 hover:shadow-xl"
                    >
                        Go to Dashboard
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default ThirdStep;