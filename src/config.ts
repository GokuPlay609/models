import dotenv from 'dotenv';
dotenv.config();

export const config = {
    prefix: process.env.PREFIX || '.',
    ownerNumber: process.env.OWNER_NUMBER || '', // Add your number here if needed for owner-only commands
};
