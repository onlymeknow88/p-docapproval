import { useEffect, useState } from 'react';

export const ProtectedRoute = ({ children }) => {
    const token = sessionStorage.getItem('token');
    const [isLoading, setIsLoading] = useState(false);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        const checkAuth = async () => {
            setIsLoading(true);
            if (!token) {
                window.location.href = '/login';
                return;
            }
            try {
                const res = await axios.get('/api/validate-token', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setIsLoading(false);
                setIsAuthenticated(true);
            } catch (error) {
                window.location.href = '/login';
            }
        };
        checkAuth();
    }, [token]);

    if (isLoading) {
        return (
            <div style={styles.loadingContainer}>
                <div style={styles.spinner}></div>
                <p>Loading...</p>
            </div>
        );
    }

    return children;
};

const styles = {
    loadingContainer: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        backgroundColor: '#f9f9f9',
        color: '#333',
        fontFamily: 'Arial, sans-serif',
    },
    spinner: {
        width: '50px',
        height: '50px',
        border: '6px solid #f3f3f3',
        borderTop: '6px solid #3498db',
        borderRadius: '50%',
        animation: 'spin 1s linear infinite',
    },
};

// Add the spinning animation in your CSS file or as a style tag
const spinnerStyles = `
@keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
}
`;

// Add this to your HTML or include it in a CSS file dynamically
if (typeof document !== 'undefined') {
    const styleSheet = document.createElement('style');
    styleSheet.type = 'text/css';
    styleSheet.innerText = spinnerStyles;
    document.head.appendChild(styleSheet);
}
