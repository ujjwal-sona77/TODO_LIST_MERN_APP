import React from "react";
import axios from "axios";



const App = () => {
return (
    <>
        <div className="min-h-screen bg-gradient-to-r from-blue-500 to-purple-600 p-8">
            <h1 className="text-center text-5xl font-bold font-arial text-white">Your Todo List</h1>
            <div className="data flex justify-between items-center bg-zinc-700 w-[90vw] mt-10 h-[80vh] rounded-lg mx-auto relative">
                    <div className="column1 bg-red-500 flex-1 h-full"></div>
                    <div className="column2 bg-cyan-500 flex-1 h-full"></div>
                    <div className="column3 bg-black flex-1 h-full"></div>
                    <div className="column4 bg-green-500 flex-1 h-full"></div>
                    <div className="column5 bg-yellow-500 flex-1 h-full"></div>
            </div>
        </div>
    </>
);
};

export default App;
