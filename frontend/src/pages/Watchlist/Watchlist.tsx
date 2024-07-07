import React from 'react';

const Watchlist: React.FC = () => {
    return (
        <div className="flex flex-col items-start w-full p-4">
            <h1 className="text-3xl font-bold mb-6 ml-[10%]">Welcome to David's Movie List</h1>
            <table className="w-4/5 border-collapse bg-white border border-[#E3E3E3] mx-auto">
                <thead>
                    <tr>
                        <th colSpan={7} className="bg-white text-black font-inter p-2 text-left" style={{ fontSize: '16px' }}>
                            Currently Watching
                        </th>
                    </tr>
                    <tr className="bg-[#0D99FF]">
                        <th className="font-inter text-white p-2 text-left" style={{ fontSize: '12px' }}>#</th>
                        <th className="font-inter text-white p-2 text-left" style={{ fontSize: '12px' }}>Title</th>
                        <th className="font-inter text-white p-2 text-left" style={{ fontSize: '12px' }}>Country</th>
                        <th className="font-inter text-white p-2 text-left" style={{ fontSize: '12px' }}>Year</th>
                        <th className="font-inter text-white p-2 text-left" style={{ fontSize: '12px' }}>Type</th>
                        <th className="font-inter text-white p-2 text-left" style={{ fontSize: '12px' }}>Score</th>
                        <th className="font-inter text-white p-2 text-left" style={{ fontSize: '12px' }}>Progress</th>
                    </tr>
                </thead>
                <tbody>
                    <tr className="bg-[#BDE3FF]">
                        <td className="font-inter text-[#0D99FF] p-2" style={{ fontSize: '12px' }}>1</td>
                        <td className="font-inter text-[#0D99FF] p-2" style={{ fontSize: '12px' }}>Mouse</td>
                        <td className="font-inter text-[#0D99FF] p-2" style={{ fontSize: '12px' }}>Korea</td>
                        <td className="font-inter text-[#0D99FF] p-2" style={{ fontSize: '12px' }}>2021</td>
                        <td className="font-inter text-[#0D99FF] p-2" style={{ fontSize: '12px' }}>Drama</td>
                        <td className="font-inter text-[#0D99FF] p-2" style={{ fontSize: '12px' }}>10</td>
                        <td className="font-inter text-[#0D99FF] p-2" style={{ fontSize: '12px' }}>Completed</td>
                    </tr>
                    <tr className="bg-white">
                        <td className="font-inter text-[#0D99FF] p-2" style={{ fontSize: '12px' }}>1</td>
                        <td className="font-inter text-[#0D99FF] p-2" style={{ fontSize: '12px' }}>Mouse</td>
                        <td className="font-inter text-[#0D99FF] p-2" style={{ fontSize: '12px' }}>Korea</td>
                        <td className="font-inter text-[#0D99FF] p-2" style={{ fontSize: '12px' }}>2021</td>
                        <td className="font-inter text-[#0D99FF] p-2" style={{ fontSize: '12px' }}>Drama</td>
                        <td className="font-inter text-[#0D99FF] p-2" style={{ fontSize: '12px' }}>10</td>
                        <td className="font-inter text-[#0D99FF] p-2" style={{ fontSize: '12px' }}>Completed</td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
};

export default Watchlist;