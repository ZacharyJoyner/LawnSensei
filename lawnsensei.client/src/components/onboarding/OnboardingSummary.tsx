// OnboardingStep1.tsx
import React, { useState } from 'react';
import { getUserLocation, getAddressFromCoordinates, getClimateZone } from '../services/locationService';

const OnboardingStep1: React.FC = () => {
    const [address, setAddress] = useState<string>('');
    const [climateZone, setClimateZone] = useState<string>('');

    const handleUseMyLocation = async () => {
        try {
            // Get user's geolocation
            const { latitude, longitude } = await getUserLocation();

            // Get the address from coordinates
            const userAddress = await getAddressFromCoordinates(latitude, longitude);
            setAddress(userAddress);

            // Determine the climate zone based on latitude
            const zone = getClimateZone(latitude);
            setClimateZone(zone);
        } catch (error) {
            alert(error);
        }
    };

    return (
        <div>
            <h2>Step 1: Lawn Details</h2>
            <button onClick={handleUseMyLocation}>Use My Location</button>
            <div>
                <label>
                    Address:
                    <input
                        type="text"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        placeholder="Enter your address"
                    />
                </label>
            </div>
            <div>
                <label>
                    Climate Zone:
                    <input
                        type="text"
                        value={climateZone}
                        readOnly
                        placeholder="Detected Climate Zone"
                    />
                </label>
            </div>
            {/* Add more inputs as needed for lawn size, etc. */}
        </div>
    );
};

export default OnboardingStep1;