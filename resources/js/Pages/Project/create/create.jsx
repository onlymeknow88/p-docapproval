import { AlertDialog, AlertDialogContent } from '@/Components/ui/alert-dialog';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

import { Button } from '@/Components/ui/button';
import ComboBox from '@/Components/ComboBox';
import DatePickerWithRange from '@/Components/DatePickerWithRange';
import DynamicTable from './DynamicTable';
import { IconPlus } from '@tabler/icons-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/Components/ui/separator';
import callAPI from '../../../config/callAPI';
import { formatRupiah } from '@/lib/utils';
import { toast } from 'sonner';
import { useForm } from '@inertiajs/react';
import { useState } from 'react';

export function Create({ vendors, project_types, units, refreshFunction }) {
    const [open, setOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const { data, setData, reset } = useForm({
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
        setIsLoading(true);
        const res = await storeData();
        // console.log(res);

        if (res.error) {
            setErrors(res.data);
            toast.error(res.message);
        } else {
            if (res.data.meta.code === 200) {
                setTimeout(() => {
                    setOpen(false);
                    toast.success(res.data.meta.message);

                    if (refreshFunction) refreshFunction();
                    setData({
                        PONum: '',
                        PRNum: '',
                        ProjectName: '',
                        Abbreviation: '',
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
                    setIsLoading(false);
                }, 1000);
            }
        }
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

    const handleCloseDialog = () => {
        // setErrors({});
        setData({
            PONum: '',
            PRNum: '',
            ProjectName: '',
            Abbreviation: '',
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
        setOpen(false);
    };

    return (
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
                <div className="flex flex-col gap-4 align-start">
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
                                <DatePickerWithRange className={'mt-1 block '} onChange={handleExecutionTimeChange} />
                            </div>
                            <div className="grid flex-1 gap-2">
                                <Label htmlFor="DpValidityPeriod">Masa Berlaku Jaminan</Label>
                                <DatePickerWithRange
                                    className={'mt-1 block '}
                                    onChange={handleDpValidityPeriodChange}
                                />
                            </div>
                            <div className="grid flex-1 gap-2">
                                <Label htmlFor="ValidityPeriodGuarantee">Masa Berlaku Jaminan Pelaksanaan </Label>
                                <DatePickerWithRange
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
                                {errors.PRNum && <span className="text-red-500 text-sm">{errors.PRNum}</span>}
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
                                {errors.PONum && <span className="text-red-500 text-sm">{errors.PONum}</span>}
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
                                {errors.VendorId && <span className="text-red-500 text-sm">{errors.VendorId}</span>}
                            </div>
                            <div className="grid flex-1 gap-2">
                                <Label htmlFor="ProjectType">Project Type</Label>
                                <ComboBox
                                    items={project_types}
                                    selectedItem={data.ProjectType}
                                    onSelect={(value) => setData('ProjectType', value)}
                                />
                                {errors.ProjectType && (
                                    <span className="text-red-500 text-sm">{errors.ProjectType}</span>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
                <Separator className="my-4" />
                {/* DynamicTable */}
                <div>
                    <h1 className="font-bold">TermSheet</h1>
                    <DynamicTable setData={setData} data={data} units={units} errors={errors} />
                </div>
                <div className="flex justify-end mt-4 gap-2">
                    <Button type="button" variant="secondary" onClick={handleCloseDialog}>
                        Cancel
                    </Button>
                    <Button type="button" variant="orange" onClick={handleSubmit}>
                        Submit
                    </Button>
                </div>
                <AlertDialog open={isLoading} onOpenChange={setIsLoading}>
                    <AlertDialogContent className="max-w-[200px] border-none ">
                        <div style={styles.loadingContainer}>
                            <div style={styles.spinner}></div>
                            <p>Loading...</p>
                        </div>
                    </AlertDialogContent>
                </AlertDialog>
            </DialogContent>
        </Dialog>
    );
}

const styles = {
    loadingContainer: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
    },
    spinner: {
        width: '40px',
        height: '40px',
        border: '4px solid #f3f3f3',
        borderTop: '4px solid #3498db',
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
