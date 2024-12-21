import { Card, CardContent } from '@/Components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { IconPlus, IconUsersGroup } from '@tabler/icons-react';

import HeaderTitle from '@/Components/HeaderTitle';
import { Button } from '@/Components/ui/button';
import AppLayout from '@/Layouts/AppLayout';
import { useForm } from '@inertiajs/react';
import { useState } from 'react';
import { toast } from 'sonner';
import callAPI from '../../../config/callAPI';
import { Create } from './create';
import { DataTable } from './data-table/DataTable';

export default function Index(props) {
    const [open, setOpen] = useState(false);
    const [refreshFunction, setRefreshFunction] = useState(null);
    const { data, setData } = useForm({
        CompanyId: '',
        DeptId: '',
        Name: '',
        Email: '',
        Position: '',
        Checker: '',
    });

    const [errors, setErrors] = useState({});

    function storeData() {
        const url = '/api/admin/orchart-approval';

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

        if (res.error) {
            setErrors(res.data);
            toast.error(res.message);
        } else {
            if (res.data.meta.code === 200) {
                setOpen(false);
                toast.success(res.data.meta.message);
                if (refreshFunction) refreshFunction();
            }
        }
    };

    return (
        <div className="flex flex-col w-full pb-32">
            <div className="flex flex-col items-start justify-between mb-8 gap-y-4 lg:flex-row lg:items-center">
                <HeaderTitle
                    title={props.page_settings.title}
                    subtitle={props.page_settings.subtitle}
                    icon={IconUsersGroup}
                />
                <Dialog open={open} onOpenChange={setOpen}>
                    <DialogTrigger asChild>
                        <Button variant="orange" size="lg">
                            <IconPlus className="size-4" />
                            Tambah
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-3xl h-full max-h-screen overflow-y-auto">
                        <DialogHeader>
                            <DialogTitle>Tambah Orchart Approval</DialogTitle>
                        </DialogHeader>

                        <Create data={data} setData={setData} handleSubmit={handleSubmit} errors={errors} />
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

Index.layout = (page) => <AppLayout children={page} title="Orchart Approval" />;
