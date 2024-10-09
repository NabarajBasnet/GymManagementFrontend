import { FaLock } from "react-icons/fa";
import { FaUnlock } from "react-icons/fa";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Breadcrumb,
    BreadcrumbEllipsis,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

const Lockers = () => {
    return (
        <div className="w-full">
            <div className='w-full p-6'>
                <Breadcrumb>
                    <BreadcrumbList>
                        <BreadcrumbItem>
                            <BreadcrumbLink href="/">Home</BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                            <DropdownMenu>
                                <DropdownMenuTrigger className="flex items-center gap-1">
                                    <BreadcrumbEllipsis className="h-4 w-4" />
                                    <span className="sr-only">Toggle menu</span>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="start">
                                    <DropdownMenuItem>Documentation</DropdownMenuItem>
                                    <DropdownMenuItem>Themes</DropdownMenuItem>
                                    <DropdownMenuItem>GitHub</DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                            <BreadcrumbLink href="/docs/components">Components</BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                            <BreadcrumbPage>Breadcrumb</BreadcrumbPage>
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>
                <h1 className="text-xl font-bold mt-3">Lockers</h1>
            </div>

            <div className="w-full bg-white">
                {/* Filter Section */}
                <div className="w-full md:flex justify-start md:space-x-9 items-end bg-gray-200 p-6">
                    <div className="w-full md:w-3/12">
                        <Label>Locker Number</Label>
                        <Select className='w-full'>
                            <SelectTrigger className="w-full rounded-none">
                                <SelectValue placeholder="Select a fruit" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectLabel>Fruits</SelectLabel>
                                    <SelectItem value="apple">Apple</SelectItem>
                                    <SelectItem value="banana">Banana</SelectItem>
                                    <SelectItem value="blueberry">Blueberry</SelectItem>
                                    <SelectItem value="grapes">Grapes</SelectItem>
                                    <SelectItem value="pineapple">Pineapple</SelectItem>
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="w-full md:w-3/12">
                        <Label>Status</Label>
                        <Select className='w-full'>
                            <SelectTrigger className="w-full rounded-none">
                                <SelectValue placeholder="Select a fruit" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectLabel>Fruits</SelectLabel>
                                    <SelectItem value="apple">Apple</SelectItem>
                                    <SelectItem value="banana">Banana</SelectItem>
                                    <SelectItem value="blueberry">Blueberry</SelectItem>
                                    <SelectItem value="grapes">Grapes</SelectItem>
                                    <SelectItem value="pineapple">Pineapple</SelectItem>
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="w-full md:w-3/12">
                        <Label>Locker Filter</Label>
                        <Select className='w-full'>
                            <SelectTrigger className="w-full rounded-none">
                                <SelectValue placeholder="Select a fruit" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectLabel>Fruits</SelectLabel>
                                    <SelectItem value="apple">Apple</SelectItem>
                                    <SelectItem value="banana">Banana</SelectItem>
                                    <SelectItem value="blueberry">Blueberry</SelectItem>
                                    <SelectItem value="grapes">Grapes</SelectItem>
                                    <SelectItem value="pineapple">Pineapple</SelectItem>
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="w-full md:w-3/12 flex justify-start items-end">
                        <Button className='rounded-none'>Submit</Button>
                    </div>
                </div>

                {/* Lockers Section*/}
                <div className="w-full">
                    <div className="p-4 grid grid-cols-1 md:grid-cols-4 gap-6">
                        {[...Array(40)].map((index) => (
                            <div key={index} className="w-full bg-white border border-gray-100 shadow-2xl p-5 cursor-pointer">
                                <div className="w-full">
                                    <div className="bg-blue-600 h-4"></div>
                                    <h1>{1}</h1>
                                    <p>Member Id: </p>
                                    <p>Locker Owner: </p>
                                    <p>Phone Number: </p>
                                    <p>Renew Date: </p>
                                    <p>Duration: </p>
                                    <p>Expire Date: </p>
                                    <Button className='rounded-none mt-4'>
                                        <FaLock className="text-xl" />
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Lockers;
