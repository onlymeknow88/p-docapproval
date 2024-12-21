import { Card, CardContent } from '@/Components/ui/card';
import { IconUserBolt } from '@tabler/icons-react';

import HeaderTitle from '@/Components/HeaderTitle';
import AppLayout from '@/Layouts/AppLayout';
import axios from 'axios';
import { useEffect } from 'react';
import { DataTable } from './data-table/DataTable';

export default function Index(props) {
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

    return (
        <div className="flex flex-col w-full pb-32">
            <div className="flex flex-col items-start justify-between mb-8 gap-y-4 lg:flex-row lg:items-center">
                <HeaderTitle
                    title={props.page_settings.title}
                    subtitle={props.page_settings.subtitle}
                    icon={IconUserBolt}
                />
            </div>
            <Card>
                {/* <CardHeader>

                </CardHeader> */}
                <CardContent className="py-4">
                    <DataTable />
                </CardContent>
            </Card>
        </div>
    );
}

Index.layout = (page) => <AppLayout children={page} title="Vendor" />;
