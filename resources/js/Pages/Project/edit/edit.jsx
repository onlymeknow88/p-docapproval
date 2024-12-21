import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

import ComboBox from '@/Components/ComboBox';
import DatePickerWithRange from '@/Components/DatePickerWithRange';
import { Button } from '@/Components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/Components/ui/separator';
import { formatRupiah } from '@/lib/utils';
import { useForm } from '@inertiajs/react';
import { IconPencil } from '@tabler/icons-react';
import { useState } from 'react';
import callAPI from '../../../config/callAPI';
import DynamicTable from './DynamicTable';

export default function Edit({ row, refreshData, vendors, project_types, units }) {
    const { data, setData } = useForm({
        id: row?.id,
        PONum: row?.PONum || '',
        PRNum: row?.PRNum || '',
        ProjectName: row?.ProjectName || '',
        Abbreviation: row?.Abbreviation || '',
        ProjectValue: row?.ProjectValue || 0,
        VendorId: row?.VendorId || '',
        ProjectType: row?.ProjectType || '',
        JobGroup: row?.JobGroup || '',
        JobDescription: row?.JobDescription || '',
        Unit: row?.Unit || '',
        UnitPriceRP: row?.UnitPriceRP || 0,
        Target: row?.Target || 0,
        DpValue: row?.DpValue || 0,
        DpValidityPeriodStart: row?.DpValidityPeriodStart || '',
        DpValidityPeriodEnd: row?.DpValidityPeriodEnd || '',
        ExecutionTimeStart: row?.ExecutionTimeStart || '',
        ExecutionTimeEnd: row?.ExecutionTimeEnd || '',
        ValidityPeriodGuaranteeStart: row?.ValidityPeriodGuaranteeStart || '',
        ValidityPeriodGuaranteeEnd: row?.ValidityPeriodGuaranteeEnd || '',
        worksheet_projects: row?.worksheet_projects || [],
    });

    const [open, setOpen] = useState(false);
    const [errors, setErrors] = useState({});

    const handleCloseDialog = () => {
        setErrors({});
        setData({
            PONum: row?.PONum || '',
            PRNum: row?.PRNum || '',
            ProjectName: row?.ProjectName || '',
            Abbreviation: row?.Abbreviation || '',
            ProjectValue: row?.ProjectValue || 0,
            VendorId: row?.VendorId || '',
            ProjectType: row?.ProjectType || '',

            DpValue: row?.DpValue || 0,
            DpValidityPeriodStart: row?.DpValidityPeriodStart || '',
            DpValidityPeriodEnd: row?.DpValidityPeriodEnd || '',
            ExecutionTimeStart: row?.ExecutionTimeStart || '',
            ExecutionTimeEnd: row?.ExecutionTimeEnd || '',
            ValidityPeriodGuaranteeStart: row?.ValidityPeriodGuaranteeStart || '',
            ValidityPeriodGuaranteeEnd: row?.ValidityPeriodGuaranteeEnd || '',
            worksheet_projects: row?.worksheet_projects || [],
        });
        setOpen(false);
    };

    const handleDpValidityPeriodChange = (selectedDate) => {
        if (selectedDate?.from && selectedDate?.to) {
            const formatToYYYYMMDD = (date) => {
                const year = date.getFullYear();
                const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
                const day = String(date.getDate()).padStart(2, '0');
                return `${year}-${month}-${day}`;
            };

            console.log('Range from:', formatToYYYYMMDD(selectedDate.from));
            console.log('Range to:', formatToYYYYMMDD(selectedDate.to));
            setData({
                ...data,
                DpValidityPeriodStart: formatToYYYYMMDD(selectedDate.from),
                DpValidityPeriodEnd: formatToYYYYMMDD(selectedDate.to),
            });
        } else {
            console.log('No valid range selected');
        }
    };

    const handleExecutionTimeChange = (selectedDate) => {
        if (selectedDate?.from && selectedDate?.to) {
            const formatToYYYYMMDD = (date) => {
                const year = date.getFullYear();
                const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
                const day = String(date.getDate()).padStart(2, '0');
                return `${year}-${month}-${day}`;
            };

            console.log('Range from:', formatToYYYYMMDD(selectedDate.from));
            console.log('Range to:', formatToYYYYMMDD(selectedDate.to));

            setData({
                ...data,
                ExecutionTimeStart: formatToYYYYMMDD(selectedDate.from),
                ExecutionTimeEnd: formatToYYYYMMDD(selectedDate.to),
            });
        } else {
            console.log('No valid range selected');
        }
    };
    const handleValidityPeriodGuaranteeChange = (selectedDate) => {
        if (selectedDate?.from && selectedDate?.to) {
            const formatToYYYYMMDD = (date) => {
                const year = date.getFullYear();
                const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
                const day = String(date.getDate()).padStart(2, '0');
                return `${year}-${month}-${day}`;
            };

            console.log('Range from:', formatToYYYYMMDD(selectedDate.from));
            console.log('Range to:', formatToYYYYMMDD(selectedDate.to));

            setData({
                ...data,
                ValidityPeriodGuaranteeStart: formatToYYYYMMDD(selectedDate.from),
                ValidityPeriodGuaranteeEnd: formatToYYYYMMDD(selectedDate.to),
            });
        } else {
            console.log('No valid range selected');
        }
    };

    console.log(row);

    function updateData() {
        const url = '/api/ami/project/' + row?.id;

        return callAPI({
            url,
            method: 'POST',
            token: true,
            data: data,
        });
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        const res = await updateData();
        console.log(res);

        if (res.error) {
            setErrors(res.data);
            toast.error(res.message);
        } else {
            if (res.data.meta.code === 200) {
                setOpen(false);
                toast.success(res.data.meta.message);
                if (refreshData) {
                    refreshData();
                }
            }
        }
    };

    return (
        <>
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                    <Button variant="blue" size="sm">
                        <IconPencil size="size-4" />
                    </Button>
                </DialogTrigger>
                <DialogContent
                    className="sm:max-w-7xl h-full max-h-screen overflow-y-auto"
                    handleCloseDialog={handleCloseDialog}
                >
                    <DialogHeader>
                        <DialogTitle>Update Orchart Approval</DialogTitle>
                    </DialogHeader>

                    <div className="flex flex-col gap-4">
                        <div className="flex items-center space-x-2">
                            <div className="grid lg:grid-cols-2 gap-4 w-full">
                                <div className="grid flex-1 gap-2">
                                    <Label htmlFor="ProjectName">Project Name</Label>
                                    <Input
                                        id="ProjectName"
                                        type="text"
                                        name="ProjectName"
                                        value={data.ProjectName}
                                        className="mt-1 block w-full"
                                        // isFocused={true}
                                        onChange={(e) => setData(e.target.name, e.target.value)}
                                    />
                                    {errors.ProjectName && (
                                        <span className="text-red-500 text-sm">{errors.ProjectName}</span>
                                    )}
                                </div>
                                <div className="grid flex-1 gap-2">
                                    <Label htmlFor="ProjectValue">Project Value</Label>
                                    <Input
                                        id="ProjectValue"
                                        type="text"
                                        name="ProjectValue"
                                        value={formatRupiah(data.ProjectValue || 0)}
                                        className="mt-1 block w-full"
                                        // isFocused={true}
                                        onChange={(e) => {
                                            const numericValue = parseFloat(e.target.value.replace(/[^\d]/g, '')) || 0;
                                            setData(e.target.name, numericValue);
                                        }}
                                    />
                                    {errors.ProjectName && (
                                        <span className="text-red-500 text-sm">{errors.ProjectName}</span>
                                    )}
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center space-x-2">
                            <div className="grid lg:grid-cols-4 gap-4 w-full">
                                <div className="grid flex-1 gap-2">
                                    <Label htmlFor="DpValue">DP Value</Label>
                                    <Input
                                        id="DpValue"
                                        type="text"
                                        name="DpValue"
                                        value={formatRupiah(data.DpValue || 0)}
                                        className="mt-1 block w-full"
                                        // isFocused={true}
                                        onChange={(e) => {
                                            const numericValue = parseFloat(e.target.value.replace(/[^\d]/g, '')) || 0;
                                            setData(e.target.name, numericValue);
                                        }}
                                    />
                                    {errors.ProjectName && (
                                        <span className="text-red-500 text-sm">{errors.ProjectName}</span>
                                    )}
                                </div>
                                <div className="grid flex-1 gap-2">
                                    <Label htmlFor="ExecutionTime">Waktu Pelaksanaan</Label>
                                    <DatePickerWithRange
                                        start={data?.ExecutionTimeStart}
                                        end={data?.ExecutionTimeEnd}
                                        className={'mt-1 block '}
                                        onChange={handleExecutionTimeChange}
                                    />
                                </div>
                                <div className="grid flex-1 gap-2">
                                    <Label htmlFor="DpValidityPeriod">Masa Berlaku Jaminan</Label>
                                    <DatePickerWithRange
                                        start={data?.DpValidityPeriodStart}
                                        end={data?.DpValidityPeriodEnd}
                                        className={'mt-1 block '}
                                        onChange={handleDpValidityPeriodChange}
                                    />
                                </div>
                                <div className="grid flex-1 gap-2">
                                    <Label htmlFor="ValidityPeriodGuarantee">Masa Berlaku Jaminan Pelaksanaan </Label>
                                    <DatePickerWithRange
                                        start={data?.ValidityPeriodGuaranteeStart}
                                        end={data?.ValidityPeriodGuaranteeEnd}
                                        className={'mt-1 block '}
                                        onChange={handleValidityPeriodGuaranteeChange}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center space-x-2">
                            <div className="grid lg:grid-cols-2 gap-4 w-full">
                                <div className="grid flex-1 gap-2">
                                    <Label htmlFor="PRNum">Nomor PR</Label>
                                    <Input
                                        id="PRNum"
                                        type="text"
                                        name="PRNum"
                                        value={data.PRNum}
                                        className="mt-1 block w-full"
                                        isFocused={true}
                                        onChange={(e) => setData(e.target.name, e.target.value)}
                                    />
                                    {errors.Name && <span className="text-red-500 text-sm">{errors.Name}</span>}
                                </div>
                                <div className="grid flex-1 gap-2">
                                    <Label htmlFor="PONum">Nomor PO</Label>
                                    <Input
                                        id="PONum"
                                        type="text"
                                        name="PONum"
                                        value={data.PONum}
                                        className="mt-1 block w-full"
                                        // isFocused={true}
                                        onChange={(e) => setData(e.target.name, e.target.value)}
                                    />
                                    {errors.ProjectName && (
                                        <span className="text-red-500 text-sm">{errors.ProjectName}</span>
                                    )}
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center space-x-2">
                            <div className="grid lg:grid-cols-2 gap-4 w-full">
                                <div className="grid flex-1 gap-2">
                                    <Label htmlFor="VendorId">Vendor Name</Label>
                                    <ComboBox
                                        items={vendors}
                                        selectedItem={data.VendorId}
                                        onSelect={(value) => setData('VendorId', value)}
                                    />
                                    {errors.ProjectName && (
                                        <span className="text-red-500 text-sm">{errors.ProjectName}</span>
                                    )}
                                </div>
                                <div className="grid flex-1 gap-2">
                                    <Label htmlFor="ProjectType">Project Type</Label>
                                    <ComboBox
                                        items={project_types}
                                        selectedItem={data.ProjectType}
                                        onSelect={(value) => setData('ProjectType', value)}
                                    />
                                    {errors.ProjectName && (
                                        <span className="text-red-500 text-sm">{errors.ProjectName}</span>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                    <Separator className="my-4" />
                    {/* DynamicTable */}
                    <div>
                        <h1 className="font-bold">TermSheet</h1>
                        <DynamicTable
                            setData={setData}
                            data={data}
                            units={units}
                            errors={errors}
                            refreshData={refreshData}
                        />
                    </div>
                    <div className="flex justify-end mt-4 gap-4">
                        <Button type="button" variant="secondary" onClick={() => setOpen(false)}>
                            Cancel
                        </Button>
                        <Button type="button" variant="orange" onClick={handleSubmit}>
                            Submit
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    );
}
