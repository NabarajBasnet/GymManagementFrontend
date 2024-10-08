import { AiOutlineLoading3Quarters } from "react-icons/ai";

const Loader = () => {
    return (
        <div className="w-full min-h-screen flex items-center justify-center">
            <AiOutlineLoading3Quarters className="text-2xl animate-spin transition-all duration-1000" />
        </div>
    )
}

export default Loader;
