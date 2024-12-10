import { Card, CardContent } from '@/Components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { IconPlus, IconUsersGroup } from '@tabler/icons-react';

import AppLayout from '@/Layouts/AppLayout';
import { Button } from '@/Components/ui/button';
import { Create } from './create/create';
import { DataTable } from './data-table/DataTable';
import HeaderTitle from '@/Components/HeaderTitle';
import { Separator } from '@/Components/ui/separator';
import callAPI from '../../config/callAPI';
import { toast } from 'sonner';
import { useForm } from '@inertiajs/react';
import { useState } from 'react';

export default function Index(props) {
    const { data: vendors } = props.vendors;
    const project_types = props.project_types;
    const units = props.units;

    const convertedDataVendor = vendors.map((item) => ({
        value: item.VendorNo,
        label: item.VendorName,
    }));

    const convertedDataProjectType = project_types.map((item) => ({
        value: item.Value,
        label: item.Text,
    }));

    const convertedDataUnit = units.map((item) => ({
        value: item.Value,
        label: item.Text,
    }));

    const [open, setOpen] = useState(false);
    const [refreshFunction, setRefreshFunction] = useState(null);
    const { data, setData } = useForm({
        PONum: '',
        PRNum: '',
        ProjectName: '',
        ProjectValue: '',
        VendorId: '',
        ProjectType: '',
        DpValue: '',
        DpValidityPeriodStart: '',
        DpValidityPeriodEnd: '',
        ExecutionTimeStart: '',
        ExecutionTimeEnd: '',
        ValidityPeriodGuaranteeStart: '',
        ValidityPeriodGuaranteeEnd: '',
        worksheet_projects: [
            {
                JobGroup: '',
                JobDescription: '',
                Unit: '',
                UnitPriceRP: '',
                Target: '',
            },
        ],
    });
    

    const [errors, setErrors] = useState({});

    function storeData() {
        const url = '/api/ami/project';

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
        // console.log(res);

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
                    <DialogContent className="sm:max-w-7xl h-full max-h-screen overflow-y-auto">
                        <DialogHeader>
                            <DialogTitle>Tambah Project</DialogTitle>
                        </DialogHeader>

                        <Separator className="my-4" />
                        <Create
                            project_types={convertedDataProjectType}
                            vendors={convertedDataVendor}
                            units={convertedDataUnit}
                            data={data}
                            setData={setData}
                            handleSubmit={handleSubmit}
                            errors={errors}
                            setOpen={setOpen}
                        />
                    </DialogContent>
                </Dialog>
            </div>
            <Card>
                {/* <CardHeader>

                </CardHeader> */}
                <CardContent className="py-4">
                    <DataTable
                        setRefreshFunction={setRefreshFunction}
                        project_types={convertedDataProjectType}
                        vendors={convertedDataVendor}
                        units={convertedDataUnit}
                    />
                </CardContent>
            </Card>
        </div>
    );
}

Index.layout = (page) => <AppLayout children={page} title="Project" />;
