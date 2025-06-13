import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

const timezones = [
    { value: "America/New_York", label: "Eastern Time (ET)" },
    { value: "America/Chicago", label: "Central Time (CT)" },
    { value: "America/Denver", label: "Mountain Time (MT)" },
    { value: "America/Los_Angeles", label: "Pacific Time (PT)" },
    { value: "Europe/London", label: "London (GMT)" },
    { value: "Europe/Paris", label: "Paris (CET)" },
    { value: "Asia/Dubai", label: "Dubai (GST)" },
    { value: "Asia/Kathmandu", label: "Kathmandu (NPT)" },
    { value: "Asia/Tokyo", label: "Tokyo (JST)" },
    { value: "Australia/Sydney", label: "Sydney (AEST)" },
];

const currencies = [
    { value: "USD", label: "US Dollar ($)" },
    { value: "EUR", label: "Euro (€)" },
    { value: "GBP", label: "British Pound (£)" },
    { value: "AUD", label: "Australian Dollar (A$)" },
    { value: "CAD", label: "Canadian Dollar (C$)" },
    { value: "NPR", label: "Nepalese Rupee (रु)" },
];

const languages = [
    { value: "en", label: "English" },
    { value: "es", label: "Spanish" },
    { value: "fr", label: "French" },
    { value: "de", label: "German" },
    { value: "ja", label: "Japanese" },
    { value: "ne", label: "Nepali" },
];

const SecondStep = () => {
    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Location & Preferences</h2>
                <p className="text-gray-600 mb-6">Configure your regional settings for proper scheduling and billing.</p>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div className="space-y-2">
                    <Label htmlFor="country">Country *</Label>
                    <Input
                        className='py-6 rounded-sm'
                        id="country"
                        placeholder="e.g. United States"
                        required
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="state">State/Province *</Label>
                    <Input
                        className='py-6 rounded-sm'
                        id="state"
                        placeholder="e.g. California"
                        required
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="city">City *</Label>
                    <Input
                        className='py-6 rounded-sm'
                        id="city"
                        placeholder="e.g. Los Angeles"
                        required
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="timezone">Timezone *</Label>
                    <Select required>
                        <SelectTrigger className='py-6 dark:bg-gray-800 rounded-sm dark:text-white'>
                            <SelectValue placeholder="Select your timezone" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                {timezones.map((tz) => (
                                    <SelectItem className='cursor-pointer hover:bg-blue-500' key={tz.value} value={tz.value}>
                                        {tz.label}
                                    </SelectItem>
                                ))}
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                    <p className="text-xs text-gray-500">Affects class scheduling and reminders</p>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="currency">Currency *</Label>
                    <Select required>
                        <SelectTrigger className='py-6 dark:bg-gray-800 rounded-sm dark:text-white'>
                            <SelectValue placeholder="Select your currency" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                {currencies.map((curr) => (
                                    <SelectItem className='cursor-pointer hover:bg-blue-500' key={curr.value} value={curr.value}>
                                        {curr.label}
                                    </SelectItem>
                                ))}
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="language">Language *</Label>
                    <Select required>
                        <SelectTrigger className='py-6 dark:bg-gray-800 rounded-sm dark:text-white'>
                            <SelectValue placeholder="Select your language" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                {languages.map((lang) => (
                                    <SelectItem className='cursor-pointer hover:bg-blue-500' key={lang.value} value={lang.value}>
                                        {lang.label}
                                    </SelectItem>
                                ))}
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                    <p className="text-xs text-gray-500">Affects your admin interface language</p>
                </div>
            </div>
        </div>
    )
}
export default SecondStep;
