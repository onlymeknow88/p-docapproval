import axios from 'axios';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs) {
    return twMerge(clsx(inputs));
}

export const checkToken = async () => {
    const token = sessionStorage.getItem('token');

    if (!token) {
        // Redirect to login if no token is found
        window.location.href = route('login');
        return false;
    }

    try {
        // Validate the token with the server
        await axios.get('/api/validate-token', {
            headers: { Authorization: `Bearer ${token}` },
        });
        return true;
    } catch (error) {
        // Redirect to login if the token is invalid
        sessionStorage.removeItem('token'); // Clear the token
        window.location.href = route('login');
        return false;
    }
};

export const formatWithoutRupiah = (number) => {
    const formatter = new Intl.NumberFormat('id-ID', {
        minimumFractionDigits: 0,
    });

    return formatter.format(number);
};

export const formatRupiah = (number) => {
    const formatter = new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
    });

    return formatter.format(number);
};
