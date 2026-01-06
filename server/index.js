import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { Resend } from 'resend';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;
const resend = new Resend(process.env.RESEND_API_KEY);

// In-memory OTP storage (in production, use Redis or a database)
const otpStore = new Map();
const OTP_EXPIRY = 5 * 60 * 1000; // 5 minutes

// Middleware
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true
}));
app.use(express.json());

// Generate 6-digit OTP
function generateOTP() {
    return Math.floor(100000 + Math.random() * 900000).toString();
}

// Clean up expired OTPs
function cleanupExpiredOTPs() {
    const now = Date.now();
    for (const [email, data] of otpStore.entries()) {
        if (now > data.expiresAt) {
            otpStore.delete(email);
        }
    }
}

// Run cleanup every minute
setInterval(cleanupExpiredOTPs, 60000);

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', message: 'Talents.MY Backend API is running' });
});

// Send OTP endpoint
app.post('/api/send-otp', async (req, res) => {
    try {
        const { email } = req.body;

        if (!email || !email.includes('@')) {
            return res.status(400).json({
                success: false,
                error: 'Valid email is required'
            });
        }

        // Generate OTP
        const otp = generateOTP();
        const expiresAt = Date.now() + OTP_EXPIRY;

        // Store OTP
        otpStore.set(email.toLowerCase(), { otp, expiresAt });

        // Send email via Resend
        const { data, error } = await resend.emails.send({
            from: process.env.FROM_EMAIL || 'onboarding@resend.dev',
            to: email,
            subject: 'Your Talents.MY Login Code',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2 style="color: #667eea;">Talents.MY Login Code</h2>
                    <p>Your one-time password (OTP) is:</p>
                    <div style="background: #f5f5f5; padding: 20px; text-align: center; font-size: 32px; font-weight: bold; letter-spacing: 8px; margin: 20px 0;">
                        ${otp}
                    </div>
                    <p style="color: #666;">This code will expire in 5 minutes.</p>
                    <p style="color: #666; font-size: 12px;">If you didn't request this code, please ignore this email.</p>
                    <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;">
                    <p style="color: #999; font-size: 12px;">Talents.MY - TikTok Affiliate Campaign Management</p>
                </div>
            `
        });

        if (error) {
            console.error('Resend error:', error);
            return res.status(500).json({
                success: false,
                error: 'Failed to send email'
            });
        }

        console.log(`OTP sent to ${email}:`, otp); // For debugging
        res.json({
            success: true,
            message: 'OTP sent successfully',
            emailId: data?.id
        });

    } catch (error) {
        console.error('Send OTP error:', error);
        res.status(500).json({
            success: false,
            error: 'Internal server error'
        });
    }
});

// Demo/Testing endpoint - Get last OTP for an email (REMOVE IN PRODUCTION)
app.get('/api/get-last-otp', (req, res) => {
    try {
        const { email } = req.query;

        if (!email) {
            return res.status(400).json({
                success: false,
                error: 'Email is required'
            });
        }

        const emailLower = email.toLowerCase();
        const storedData = otpStore.get(emailLower);

        if (!storedData) {
            return res.status(404).json({
                success: false,
                error: 'No OTP found'
            });
        }

        // Return the OTP for demo purposes
        res.json({
            success: true,
            otp: storedData.otp,
            expiresAt: storedData.expiresAt
        });

    } catch (error) {
        console.error('Get OTP error:', error);
        res.status(500).json({
            success: false,
            error: 'Internal server error'
        });
    }
});

// Verify OTP endpoint
app.post('/api/verify-otp', (req, res) => {
    try {
        const { email, otp } = req.body;

        if (!email || !otp) {
            return res.status(400).json({
                success: false,
                error: 'Email and OTP are required'
            });
        }

        const emailLower = email.toLowerCase();
        const storedData = otpStore.get(emailLower);

        if (!storedData) {
            return res.status(400).json({
                success: false,
                error: 'No OTP found for this email'
            });
        }

        // Check if expired
        if (Date.now() > storedData.expiresAt) {
            otpStore.delete(emailLower);
            return res.status(400).json({
                success: false,
                error: 'OTP has expired'
            });
        }

        // Verify OTP
        if (storedData.otp !== otp) {
            return res.status(400).json({
                success: false,
                error: 'Invalid OTP'
            });
        }

        // OTP is valid - remove it (one-time use)
        otpStore.delete(emailLower);

        res.json({
            success: true,
            message: 'OTP verified successfully'
        });

    } catch (error) {
        console.error('Verify OTP error:', error);
        res.status(500).json({
            success: false,
            error: 'Internal server error'
        });
    }
});

app.listen(PORT, () => {
    console.log(`🚀 Talents.MY Backend running on http://localhost:${PORT}`);
    console.log(`📧 Resend API Key: ${process.env.RESEND_API_KEY ? '✓ Configured' : '✗ Missing'}`);
});
