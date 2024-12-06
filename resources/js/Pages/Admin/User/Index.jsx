import { Card, CardContent } from '@/Components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { IconPlus, IconUser } from '@tabler/icons-react';
import { useEffect, useState } from 'react';

import AppLayout from '@/Layouts/AppLayout';
import { Button } from '@/Components/ui/button';
import {Create} from './Create';
import { DataTable } from './data-table/DataTable';
import HeaderTitle from '@/Components/HeaderTitle';
import axios from 'axios';
import callAPI from '../../../config/callAPI';
import { toast } from 'sonner';
import { useForm } from '@inertiajs/react';

export default function Index(props) {
    const [refreshFunction, setRefreshFunction] = useState(null);
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

    const { data, setData } = useForm({
        name: '',
        username: '',
        password: '',
        email: '',
    });

    const [open, setOpen] = useState(false);
    const [errors, setErrors] = useState({});
    const [checkUsernameError, setCheckUsernameError] = useState('');

    function checkUsername(username) {
        const url = '/api/admin/user/check-username?username=' + username;

        return callAPI({
            url,
            method: 'GET',
            token: true,
        });
    }

    const handleCheckUsername = async (e) => {
        const { name, value } = e.target;

        setData(name, value);

        const res = await checkUsername(value);

        if (res.error) {
            setCheckUsernameError(res.data);
        } else {
            setCheckUsernameError('');
        }
    };

    function storeData() {
        const url = '/api/admin/user';

        return callAPI({
            url,
            method: 'POST',
            token: true,
            data: data,
        });
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        const res = await storeData();


        if (res.data.meta.code === 200) {
            setOpen(false);
            toast.success(res.data.meta.message);
            if (refreshFunction) refreshFunction(); 
        } else {
            toast.error(res.data.meta.message);
        }
    };

    return (
        <div className="flex flex-col w-full pb-32">
            <div className="flex flex-col items-start justify-between mb-8 gap-y-4 lg:flex-row lg:items-center">
                <HeaderTitle
                    title={props.page_settings.title}
                    subtitle={props.page_settings.subtitle}
                    icon={IconUser}
                />
                <Dialog open={open} onOpenChange={setOpen}>
                    <DialogTrigger asChild>
                        <Button variant="orange" size="lg">
                            <IconPlus className="size-4" />
                            Tambah
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-3xl">
                        <DialogHeader>
                            <DialogTitle>Tambah User</DialogTitle>
                        </DialogHeader>

                        <Create data={data} setData={setData} handleSubmit={handleSubmit} />
                    </DialogContent>
                </Dialog>
            </div>
            <Card>
                {/* <CardHeader>

                </CardHeader> */}
                <CardContent className="py-4">
                    <DataTable setRefreshFunction={setRefreshFunction} />
                </CardContent>
            </Card>
        </div>
    );
}

Index.layout = (page) => <AppLayout children={page} title="User" />;
