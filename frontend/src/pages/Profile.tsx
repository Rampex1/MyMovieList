import React, { useState } from 'react';

const Profile: React.FC = () => {
    const [logo, setLogo] = useState<string | null>(null);

    const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setLogo(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <div className="flex p-5 rounded-lg mt-24">
            <div className="w-40 h-40 mr-5">
                {logo ? (
                    <img src={logo} alt="Profile Logo" className="w-full h-full object-cover rounded-lg" />
                ) : (
                    <div className="w-full h-full bg-blue-500 flex justify-center items-center text-white text-6xl rounded-lg">
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleLogoUpload}
                            id="logo-upload"
                            className="hidden"
                        />
                        <label htmlFor="logo-upload" className="cursor-pointer p-2 bg-white bg-opacity-20 rounded">
                            R
                        </label>
                    </div>
                )}
            </div>
            <div className="flex-grow">
                <h1 className="text-2xl font-bold mb-5">Rampex's Profile</h1>
                <div className="flex gap-5">
                    <div className="flex-1 bg-white p-4 rounded-lg">
                        <h2 className="text-xl font-semibold mb-3">Statistics</h2>
                        <div className="mb-2">
                            <p className="text-sm text-gray-600">All time series</p>
                            <p className="font-bold">23d 12h 51m</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-600">All time movies</p>
                            <p className="font-bold">23d 12h 51m</p>
                        </div>
                    </div>
                    <div className="flex-1 bg-white p-4 rounded-lg">
                        <h2 className="text-xl font-semibold mb-3">Updates</h2>
                        {/* Add update content here */}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;