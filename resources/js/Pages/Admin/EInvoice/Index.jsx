import { Card, CardContent } from '@/Components/ui/card';
import { IconPlus, IconUserBolt } from '@tabler/icons-react';

import HeaderTitle from '@/Components/HeaderTitle';
import { Button } from '@/Components/ui/button';
import AppLayout from '@/Layouts/AppLayout';
import { Link } from '@inertiajs/react';
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
                <Button variant="orange" size="lg" asChild>
                    <Link href="#">
                        <IconPlus className="size-4" />
                        Tambah
                    </Link>
                </Button>
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
