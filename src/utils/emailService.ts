// API configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

export const sendOTP = async (email: string): Promise<{ success: boolean; error?: string }> => {
    try {
        const response = await fetch(`${API_BASE_URL}/api/send-otp`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email }),
        });

        const data = await response.json();

        if (!response.ok) {
            return {
                success: false,
                error: data.error || 'Failed to send OTP'
            };
        }

        return { success: true };
    } catch (error) {
        console.error('Send OTP error:', error);
        return {
            success: false,
            error: 'Network error. Please check if the backend server is running.'
        };
    }
};

export const verifyOTPBackend = async (email: string, otp: string): Promise<{ success: boolean; error?: string }> => {
    try {
        const response = await fetch(`${API_BASE_URL}/api/verify-otp`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, otp }),
        });

        const data = await response.json();

        if (!response.ok) {
            return {
                success: false,
                error: data.error || 'Failed to verify OTP'
            };
        }

        return { success: true };
    } catch (error) {
        console.error('Verify OTP error:', error);
        return {
            success: false,
            error: 'Network error. Please check if the backend server is running.'
        };
    }
};
