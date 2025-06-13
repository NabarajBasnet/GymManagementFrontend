import { Button } from "@/components/ui/button";
import { CheckCircle2 } from "lucide-react";

const ThirdStep = () => {
    return (
        <div className="space-y-8 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                <CheckCircle2 className="h-6 w-6 text-green-600" />
            </div>

            <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-200">You're all set!</h2>
                <p className="mt-2 text-gray-600 dark:text-gray-200">
                    Your gym management system is ready to go. Let's start optimizing your fitness business.
                </p>
            </div>

            <div className="rounded-lg bg-gray-50 dark:bg-gray-900 p-6 text-left">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Next Steps</h3>
                <ul className="space-y-3">
                    <li className="flex items-start">
                        <span className="flex h-5 w-5 dark:text-black flex-shrink-0 items-center justify-center rounded-full bg-primary text-white mr-3 mt-0.5">1</span>
                        <span className="text-gray-700 dark:text-gray-200">Add your staffs</span>
                    </li>
                    <li className="flex items-start">
                        <span className="flex h-5 w-5 dark:text-black flex-shrink-0 items-center justify-center rounded-full bg-primary text-white mr-3 mt-0.5">2</span>
                        <span className="text-gray-700 dark:text-gray-200">Set up your classes and schedules</span>
                    </li>
                    <li className="flex items-start">
                        <span className="flex h-5 w-5 dark:text-black flex-shrink-0 items-center justify-center rounded-full bg-primary text-white mr-3 mt-0.5">3</span>
                        <span className="text-gray-700 dark:text-gray-200">Import or add your members</span>
                    </li>
                    <li className="flex items-start">
                        <span className="flex h-5 w-5 dark:text-black flex-shrink-0 items-center justify-center rounded-full bg-primary text-white mr-3 mt-0.5">3</span>
                        <span className="text-gray-700 dark:text-gray-200">Create branches and users</span>
                    </li>
                </ul>
            </div>

            <div className="pt-4">
                <p className="text-sm text-gray-500 dark:text-gray-200">
                    You can always change these settings later in your account preferences.
                </p>
            </div>
        </div>
    )
}
export default ThirdStep;