import AppLayout from '@/Layouts/AppLayout';
import axios from 'axios';
import { useEffect } from 'react';

export default function Dashboard() {

    useEffect(() => {
        const token = sessionStorage.getItem('token');

        if (!token) {
            // Redirect to login if no token is found
            window.location.href = route('login');
        } else {
            // Optionally, validate the token with the server
            axios
                .get('/api/validate-token', {
                    headers: { Authorization: `Bearer ${token}` },
                })
                .catch(() => {
                    // Redirect to login if token is invalid
                    sessionStorage.removeItem('token'); // Clear the token
                    window.location.href = route('login');
                });
        }
    }, []);



    return <>Ini Dashboard</>;
}



Dashboard.layout = (page) => <AppLayout children={page} title="Dashboard"/>;
