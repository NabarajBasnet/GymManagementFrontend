import { FaEnvelope, FaPhone, FaHeadset, FaQuestionCircle, FaComments } from "react-icons/fa";

const CustomerSupport = () => {
    const supportOptions = [
        {
            title: "FAQs",
            description: "Find quick answers to the most common questions.",
            icon: <FaQuestionCircle size={28} className="text-blue-500" />,
        },
        {
            title: "Live Chat",
            description: "Chat with our support team for immediate assistance.",
            icon: <FaComments size={28} className="text-green-500" />,
        },
        {
            title: "Email Support",
            description: "Send us an email and we’ll get back to you within 24 hours.",
            icon: <FaEnvelope size={28} className="text-yellow-500" />,
        },
        {
            title: "Call Us",
            description: "Reach out to us directly via phone during business hours.",
            icon: <FaPhone size={28} className="text-red-500" />,
        },
        {
            title: "Submit a Ticket",
            description: "Open a support ticket and track its progress.",
            icon: <FaHeadset size={28} className="text-purple-500" />,
        },
    ];

    return (
        <div className="min-h-screen p-6">
            <h1 className="text-4xl font-bold mb-6 text-center">🛠️ Customer Support</h1>
            <p className="text-gray-900 text-center mb-8">
                How can we help you? Choose from the options below to get support.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
                {supportOptions.map((option, index) => (
                    <div
                        key={index}
                        className="flex items-center p-4 rounded-lg shadow-md hover:bg-gray-100 hover:scale-105 transition-all duration-300"
                    >
                        <div className="mr-4">{option.icon}</div>
                        <div>
                            <h2 className="text-lg font-semibold">{option.title}</h2>
                            <p className="text-sm text-gray-400">{option.description}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Contact Information */}
            <div className="mt-12 text-center">
                <h2 className="text-2xl font-bold mb-4">📞 Contact Us</h2>
                <p className="text-gray-400 mb-2">
                    Need more help? Get in touch with us directly.
                </p>
                <div className="text-lg">
                    <p>Email: <a href="mailto:support@gymmanager.com" className="text-blue-400 hover:underline">revivefitnessnp@gmail.com</a></p>
                    <p>Phone: <a href="tel:+1234567890" className="text-blue-400 hover:underline">+977 9843567690 / +977 9869345511</a></p>
                </div>
            </div>
        </div>
    );
};

export default CustomerSupport;
