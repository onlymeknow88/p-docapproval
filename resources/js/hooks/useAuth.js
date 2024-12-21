import axios from 'axios';
import { useEffect } from 'react';

const useAuth = () => {
    const token = sessionStorage.getItem('token'); // Fetch auth data from sessionStorage or wherever you store it

    useEffect(() => {
        const checkAuth = async () => {
            if (!token) {
                window.location.href = '/login'; // Redirect to login if token is not found
                return;
            }

            try {
                // Validate the token via an API call
                const res = await axios.get('/api/validate-token', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
            } catch (error) {
                // Redirect if the token is invalid or expired
                window.location.href = '/login';
            }
        };

        checkAuth();
    }, [token]);

    return null; // No return needed for this hook
};

export default useAuth;
