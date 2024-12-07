import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

import { Button } from '@/Components/ui/button';
import { IconPencil } from '@tabler/icons-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import callAPI from '@/config/callAPI';
import { toast } from 'sonner';
import { useForm } from '@inertiajs/react';
import { useState } from 'react';

export default function Edit({ row, refreshData }) {
    const { data, setData } = useForm({
        name: row?.name || '',
        username: row?.username || '',
        password: '',
        email: row?.email || '',
    });

    const [open, setOpen] = useState(false);

    const [refreshFunction, setRefreshFunction] = useState(null);

    function updateData() {
        const url = '/api/admin/user/' + row?.id;

        return callAPI({
            url,
            method: 'POST',
            token: true,
            data: data,
        });
    }

    function checkUsername(username) {
        const url = '/api/admin/user/check-username?username=' + username;

        return callAPI({
            url,
            method: 'GET',
            token: true,
        });
    }

    const [errors, setErrors] = useState({});
    const [checkUsernameError, setCheckUsernameError] = useState('');

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

    const handleUpdate = async (e) => {
        e.preventDefault();

        const res = await updateData();

        if (res.error) {
            setErrors(res.data);
            toast.error(res.message);
        }

        if (res.data.meta.code === 200) {
            setOpen(false);
            toast.success(res.data.meta.message);

            if (refreshData) {
                refreshData();
            }
        }
    };

    const handleCloseDialog = () => {
        setErrors({});
        setCheckUsernameError('');
        setData({
            name: row?.name || '',
            username: row?.username || '',
            password: '',
            email: row?.email || '',
        });
        setOpen(false);
    };

    return (
        <>
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                    <Button variant="blue" size="sm">
                        <IconPencil size="size-4" />
                    </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-3xl" handleCloseDialog={handleCloseDialog}>
                    <DialogHeader>
                        <DialogTitle>Update User</DialogTitle>
                    </DialogHeader>

                    <div className="grid gap-4">
                        <div className="flex items-center space-x-2">
                            <div className="grid flex-1 gap-2">
                                <Label htmlFor="name">Nama</Label>
                                <Input
                                    id="name"
                                    type="text"
                                    name="name"
                                    value={data.name}
                                    className={`${errors.name ? 'border-red-500' : ''} mt-1 block w-full`}
                                    autoComplete="name"
                                    isFocused={true}
                                    placeholder="Jhon Doe Example"
                                    onChange={(e) => setData(e.target.name, e.target.value)}
                                />
                                {errors.name && <span className="text-red-500 text-sm">{errors.name}</span>}
                            </div>
                        </div>
                        <div className="flex items-center space-x-2">
                            <div className="grid flex-1 gap-2">
                                <Label htmlFor="username">Username</Label>
                                <Input
                                    id="username"
                                    type="text"
                                    name="username"
                                    value={data.username}
                                    className={`${errors.username || checkUsernameError ? 'border-red-500' : ''} mt-1 block w-full`}
                                    autoComplete="username"
                                    isFocused={true}
                                    placeholder="jdoe example"
                                    onChange={(e) => handleCheckUsername(e)}
                                />
                                {errors.username && <span className="text-red-500 text-sm">{errors.username}</span>}
                                {checkUsernameError && (
                                    <span className="text-red-500 text-sm">{checkUsernameError}</span>
                                )}
                            </div>
                        </div>
                        <div className="flex items-center space-x-2">
                            <div className="grid flex-1 gap-2">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    name="email"
                                    value={data.email}
                                    className={`${errors.email ? 'border-red-500' : ''} mt-1 block w-full`}
                                    autoComplete="email"
                                    isFocused={true}
                                    placeholder="a@example.com"
                                    onChange={(e) => setData(e.target.name, e.target.value)}
                                />
                                {errors.email && <span className="text-red-500 text-sm">{errors.email}</span>}
                            </div>
                        </div>
                        <div className="flex items-center space-x-2">
                            <div className="grid flex-1 gap-2">
                                <Label htmlFor="password">Password</Label>
                                <Input
                                    id="password"
                                    type="password"
                                    name="password"
                                    value={data.password}
                                    className={`${errors.password ? 'border-red-500' : ''} mt-1 block w-full`}
                                    isFocused={true}
                                    onChange={(e) => setData(e.target.name, e.target.value)}
                                />
                                {errors.password && <span className="text-red-500 text-sm">{errors.password}</span>}
                            </div>
                        </div>
                    </div>
                    <div className="flex justify-end mt-4 gap-2">
                        <Button type="button" variant="ghost" onClick={handleCloseDialog}>
                            Close
                        </Button>
                        <Button type="button" variant="orange" onClick={handleUpdate}>
                            Update
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    );
}
