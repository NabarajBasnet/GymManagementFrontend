'use client'

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"


const newMemberRegistrationForm = () => {

    return (
        <div className="w-full flex justify-center p-1">
            <div className="w-full flex justify-center">
                <div className="w-full">
                    <h2 className="text-xl font-bold text-center">Register New Member</h2>
                    <div className="w-full">
                        <form className="w-full">
                            <div className="bg-gray-300 py-2 my-2 w-full">
                                <h1 className="mx-4 font-semibold">Personal Information</h1>
                            </div>
                            <div className="p-2 bg-white">
                                <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                                    <div>
                                        <Label>First Name</Label>
                                        <Input
                                            className='rounded-none focus:outline-none'
                                            placeholder='First Name'
                                        />
                                    </div>

                                    <div>
                                        <Label>Last Name</Label>
                                        <Input
                                            className='rounded-none focus:outline-none'
                                            placeholder='Last Name'
                                        />
                                    </div>

                                    <div>
                                        <Label>Address</Label>
                                        <Input
                                            className='rounded-none focus:outline-none'
                                            placeholder='Address'
                                        />
                                    </div>

                                    <div>
                                        <Label>Phone Number</Label>
                                        <Input
                                            className='rounded-none focus:outline-none'
                                            placeholder='Phone Number'
                                        />
                                    </div>

                                    <div>
                                        <Label>Secondary Phone Number</Label>
                                        <Input
                                            className='rounded-none focus:outline-none'
                                            placeholder='Secondary Phone Number'
                                        />
                                    </div>

                                    <div>
                                        <Label>Email Address</Label>
                                        <Input
                                            className='rounded-none focus:outline-none'
                                            placeholder='Email Address'
                                        />
                                    </div>

                                    <div>
                                        <Label>Date Of Birth</Label>
                                        <Input
                                            className='rounded-none focus:outline-none'
                                            placeholder='Date Of Birth'
                                        />
                                    </div>

                                    <div>
                                        <Label>Date Of Birth</Label>
                                        <Select>
                                            <SelectTrigger className="w-full rounded-none">
                                                <SelectValue placeholder="Select Gender" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectGroup>
                                                    <SelectLabel>Gender</SelectLabel>
                                                    <SelectItem value="Male">Male</SelectItem>
                                                    <SelectItem value="Female">Female</SelectItem>
                                                    <SelectItem value="Other">Other</SelectItem>
                                                </SelectGroup>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-gray-300 py-2 my-2 w-full">
                                <h1 className="mx-4 font-semibold">Membership Information</h1>
                            </div>
                            <div className="p-2 bg-white">
                                <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                                    <div>
                                        <Label>Membership Option</Label>
                                        <Select>
                                            <SelectTrigger className="w-full rounded-none">
                                                <SelectValue placeholder="Membership Option" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectGroup>
                                                    <SelectLabel>Membership Option</SelectLabel>
                                                    <SelectItem value="Regular">Regular</SelectItem>
                                                    <SelectItem value="Day Time">Day Time</SelectItem>
                                                    <SelectItem value="Temporary">Temporary</SelectItem>
                                                </SelectGroup>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div>
                                        <Label>Membership Type</Label>
                                        <Select>
                                            <SelectTrigger className="w-full rounded-none">
                                                <SelectValue placeholder="Membership Type" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectGroup>
                                                    <SelectLabel>Membership Type</SelectLabel>
                                                    <SelectItem value="Gym">Gym</SelectItem>
                                                    <SelectItem value="Gym & Cardio">Gym & Cardio</SelectItem>
                                                </SelectGroup>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div>
                                        <Label>Membership Date</Label>
                                        <Input
                                            type='date'
                                            className='rounded-none focus:outline-none'
                                            placeholder='Membership Date'
                                        />
                                    </div>

                                    <div>
                                        <Label>Duration</Label>
                                        <Select>
                                            <SelectTrigger className="w-full rounded-none">
                                                <SelectValue placeholder="Duration" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectGroup>
                                                    <SelectLabel>Duration</SelectLabel>
                                                    <SelectItem value="1 Month">1 Month</SelectItem>
                                                    <SelectItem value="3 Months">3 Months</SelectItem>
                                                    <SelectItem value="6 Months">6 Months</SelectItem>
                                                    <SelectItem value="12 Months">12 Months</SelectItem>
                                                </SelectGroup>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div>
                                        <Label>Membership Renew Date</Label>
                                        <Input
                                            type='date'
                                            className='rounded-none focus:outline-none'
                                            placeholder='Membership Renew Date'
                                        />
                                    </div>

                                    <div>
                                        <Label>Membership Expire Date</Label>
                                        <Input
                                            type='date'
                                            className='rounded-none focus:outline-none'
                                            placeholder='Membership Expire Date'
                                        />
                                    </div>

                                </div>
                            </div>

                            <div className="bg-gray-300 py-2 my-2 w-full">
                                <h1 className="mx-4 font-semibold">Payment Details</h1>
                            </div>
                            <div className="p-2 bg-white">
                                <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                                    <div>
                                        <Label>Payment Method</Label>
                                        <Select>
                                            <SelectTrigger className="w-full rounded-none">
                                                <SelectValue placeholder="Payment Method" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectGroup>
                                                    <SelectLabel>Payment Method</SelectLabel>
                                                    <SelectItem value="Fonepay">Fonepay</SelectItem>
                                                    <SelectItem value="Cash">Cash</SelectItem>
                                                    <SelectItem value="Card">Card</SelectItem>
                                                </SelectGroup>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div>
                                        <Label>Discount Ammount</Label>
                                        <Input
                                            type='text'
                                            className='rounded-none focus:outline-none'
                                            placeholder='Discount Ammount'
                                        />
                                    </div>

                                    <div>
                                        <Label>Discount Reason</Label>
                                        <Input
                                            type='text'
                                            className='rounded-none focus:outline-none'
                                            placeholder='Discount Reason'
                                        />
                                    </div>

                                    <div>
                                        <Label>Discount Code</Label>
                                        <Input
                                            type='text'
                                            className='rounded-none focus:outline-none'
                                            placeholder='Discount Code'
                                        />
                                    </div>

                                    <div>
                                        <Label>Admission Fee</Label>
                                        <Input
                                            type='text'
                                            defaultValue={'1000'}
                                            className='rounded-none focus:outline-none'
                                            placeholder='Admission Fee'
                                        />
                                    </div>

                                    <div>
                                        <Label>Final Ammount</Label>
                                        <Input
                                            type='text'
                                            className='rounded-none focus:outline-none'
                                            placeholder='Final Ammount'
                                        />
                                    </div>

                                    <div>
                                        <Label>Paid Ammount</Label>
                                        <Input
                                            type='text'
                                            className='rounded-none focus:outline-none'
                                            placeholder='Paid Ammount'
                                        />
                                    </div>

                                    <div>
                                        <Label>Due Ammount</Label>
                                        <Input
                                            type='text'
                                            className='rounded-none focus:outline-none'
                                            placeholder='Due Ammount'
                                        />
                                    </div>

                                    <div>
                                        <Label>Receipt No</Label>
                                        <Input
                                            type='text'
                                            className='rounded-none focus:outline-none'
                                            placeholder='Receipt No'
                                        />
                                    </div>

                                    <div>
                                        <Label>Remark</Label>
                                        <Input
                                            type='text'
                                            className='rounded-none focus:outline-none'
                                            placeholder='Remark'
                                        />
                                    </div>

                                    <div>
                                        <Label>Action Taker</Label>
                                        <Select>
                                            <SelectTrigger className="w-full rounded-none">
                                                <SelectValue placeholder="Action Taker" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectGroup>
                                                    <SelectLabel>Action Taker</SelectLabel>
                                                    <SelectItem value="1 Month">Admin</SelectItem>
                                                    <SelectItem value="3 Months">Author</SelectItem>
                                                    <SelectItem value="6 Months">Member</SelectItem>
                                                </SelectGroup>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                </div>
                            </div>
                            <div className="flex items-center space-x-2 p-2">
                                <Button variant='destructive' className='rounded-none'>Finalize</Button>
                                <Button className='rounded-none'>Register</Button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default newMemberRegistrationForm;
