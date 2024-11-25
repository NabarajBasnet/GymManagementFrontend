import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function StaffLogin() {

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center">
            <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md">
                <h2 className="text-4xl font-bold text-gray-800 text-center mb-6">
                    Revive Fitness
                </h2>
                <h2 className="text-2xl font-bold text-gray-800 text-center mb-6">
                    Staff Login
                </h2>
                <form>
                    <div className="mb-4">
                        <Label htmlFor="email" className="block text-gray-700 font-medium mb-2">
                            Email Address
                        </Label>
                        <Input
                            type="email"
                            id="email"
                            name="email"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                            placeholder="Enter your email"
                        />
                    </div>
                    <div className="mb-6">
                        <Label htmlFor="password" className="block text-gray-700 font-medium mb-2">
                            Password
                        </Label>
                        <Input
                            type="password"
                            id="password"
                            name="password"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                            placeholder="Enter your password"
                        />
                    </div>
                    <Button
                        type="submit"
                        className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition"
                    >
                        Login
                    </Button>
                </form>
            </div>
        </div>
    );
}
