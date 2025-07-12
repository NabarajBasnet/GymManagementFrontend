const RootSidebar = () => {
    return (
        <div className="w-[240px] h-screen flex flex-col bg-gray-300">
            <header className="sticky top-0 py-4 bg-blue-600 z-10">
                <h1>Root Header</h1>
            </header>

            {/* Make body scrollable only within sidebar */}
            <div className="flex-1 overflow-y-auto">
                {Array.from({ length: 40 }).map((_, i) => (
                    <h1 key={i}>Root Body {i + 1}</h1>
                ))}
            </div>

            <footer className="sticky bottom-0 py-4 bg-red-600 z-10">
                <h1>Root Footer</h1>
            </footer>
        </div>
    );
};

export default RootSidebar;
