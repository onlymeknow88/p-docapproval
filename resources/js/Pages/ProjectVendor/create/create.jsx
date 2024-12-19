import { AlertDialog, AlertDialogContent } from '@/Components/ui/alert-dialog';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { IconPlus, IconSearch } from '@tabler/icons-react';

import { Button } from '@/Components/ui/button';
import ComboBox from '@/Components/ComboBox';
import DynamicTable from './DynamicTable';
import { Input } from '@/Components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/Components/ui/separator';
import TermSheetModal from './TermSheetModal';
import axios from 'axios';
import callAPI from '../../../config/callAPI';
import { formatRupiah } from '@/lib/utils';
import { toast } from 'sonner';
import { useForm } from '@inertiajs/react';
import { useState } from 'react';

export function Create({ projects, ba_types, companies, refreshFunction }) {
    const [isLoading, setIsLoading] = useState(false);
    const [open, setOpen] = useState(false);
    const { data, setData } = useForm({
        idProject: '',
        Company: '',
        PONum: '',
        BAType: '',
        ProjectName: '',
        VendorName: '',
        ProjectValue: '',
        ProgressValue: '',
        WorkProgressPercent: '',
        PICName: '',
        PICPosition: '',
        PICAddress: '',
        PICIdCardNo: '',
        worksheet_projects: [],
        upload_file: [],
    });

    const [termSheet, setTermSheet] = useState([]);

    function getTermSheet(value) {
        const url = '/api/vendor/project-vendor/' + value + '/term-sheet';

        return callAPI({
            url,
            method: 'GET',
            token: true,
        });
    }

    function showDataProject(PONum) {
        const url = '/api/vendor/project-vendor/' + PONum + '/show-project';

        return callAPI({
            url,
            method: 'GET',
            token: true,
        });
    }

    const [project_type, setProjectType] = useState('');

    const fetchProject = async (value) => {
        setIsLoading(true);
        const res = await showDataProject(value);

        if (res.data.meta.code === 200) {
            setTimeout(() => {
                const id = res.data.result.id;
                setProjectType(res.data.result.ProjectType);
                setData({
                    ...data,
                    idProject: id,
                    PONum: value,
                    ProjectName: res.data.result.ProjectName,
                    VendorName: res.data.result.vendor.VendorName,
                    ProjectValue: res.data.result.ProjectValue,
                });
                setIsLoading(false);
            }, 1000);
        }
    };

    const fetchTermSheet = async (id) => {
        setIsLoading(true);
        const res = await getTermSheet(id);
        if (res.data.meta.code === 200) {
            setTimeout(() => {
                setIsModalOpen(true);
                setTermSheet(res.data.result);
                setIsLoading(false);
            }, 1000);
        }
    };

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedRows, setSelectedRows] = useState([]);
    // const openModal = () => {
    //     setIsModalOpen(true);
    // };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    const handleCloseDialog = () => {
        setErrors({});
        setData({
            idProject: '',
            PONum: '',
            BAType: '',
            ProjectName: '',
            VendorName: '',
            ProjectValue: '',
            ProgressValue: '',
            WorkProgressPercent: '',
            PICName: '',
            PICPosition: '',
            PICAddress: '',
            PICIdCardNo: '',
            upload_file: [],
            worksheet_projects: [],
        });
        setProjectType('');

        setOpen(false);
    };

    const [appSCurvedFile, setAppSCurvedFile] = useState(null);
    const [dokumenScan, setDokumenScan] = useState(null);
    const [dokumentasiProgress, setDokumentasiProgress] = useState(null);
    const [rincianProgress, setRincianProgress] = useState(null);
    const [otherDokumen, setOtherDokumen] = useState(null);

    const [errors, setErrors] = useState({});

    function draftApp(type) {
        const url = '/api/vendor/project-vendor?type=' + type;

        return callAPI({
            url,
            method: 'POST',
            token: true,
            data: data,
        });
    }

    function submitAppData(type) {
        const url = '/api/vendor/project-vendor?type=' + type;

        return callAPI({
            url,
            method: 'POST',
            token: true,
            data: data,
        });
    }

    const handleUploadFile = (e) => {
        const file = e.target.files[0];
        const { name } = e.target;

        switch (name) {
            case 'appSCurvedFile':
                setAppSCurvedFile(file);
                break;
            case 'dokumenScan':
                setDokumenScan(file);
                break;
            case 'dokumentasiProgress':
                setDokumentasiProgress(file);
                break;
            case 'rincianProgress':
                setRincianProgress(file);
                break;
            case 'otherDokumen':
                setOtherDokumen(file);
                break;
            default:
                console.warn('Unhandled file input:', name);
        }
    };

    const handleSubmit = async (type) => {
        setIsLoading(true);
        const token = sessionStorage.getItem('token');
        const allFiles = [
            { file: appSCurvedFile, name: 'appSCurvedFile' },
            { file: dokumenScan, name: 'dokumenScan' },
            { file: dokumentasiProgress, name: 'dokumentasiProgress' },
            { file: rincianProgress, name: 'rincianProgress' },
            { file: otherDokumen, name: 'otherDokumen' },
        ];

        if (type === 'Draft') {
            const res = await draftApp(type);

            if (res.error) {
                setErrors(res.data);
                toast.error('Failed Submit Check Form Input');
            } else {
                if (res.data.meta.code === 200) {
                    const formData = new FormData();
                    for (const { file, name } of allFiles) {
                        if (file) {
                            console.log(`Uploading ${name}...`);

                            formData.append('files[]', file);
                            formData.append('NameType[]', name);
                        }
                    }
                    formData.append('type', type);
                    formData.append('id', res.data.result.project.id);
                    await axios.post('/api/vendor/project-vendor/upload-file', formData, {
                        headers: {
                            'Content-Type': 'multipart/form-data',
                            Accept: 'application/json',
                            Authorization: `Bearer ${token}`,
                        },
                    });
                    setTimeout(() => {
                        setProjectType('');
                        setData({
                            idProject: '',
                            PONum: '',
                            BAType: '',
                            ProjectName: '',
                            VendorName: '',
                            ProjectValue: '',
                            ProgressValue: '',
                            WorkProgressPercent: '',
                            PICName: '',
                            PICPosition: '',
                            PICAddress: '',
                            PICIdCardNo: '',
                            worksheet_projects: [],
                        });
                        setOpen(false);
                        toast.success(res.data.meta.message);
                        setIsLoading(false);
                    }, 1000);
                    if (refreshFunction) refreshFunction();
                }
            }
        } else if (type === 'Submit') {
            const res = await submitAppData(type);

            if (res.error) {
                setErrors(res.data);
                toast.error('Failed Submit Check Form Input');
                setIsLoading(false);
            } else {
                if (res.data.meta.code === 200) {
                    const formData = new FormData();
                    for (const { file, name } of allFiles) {
                        if (file) {
                            console.log(`Uploading ${name}...`);

                            formData.append('files[]', file);
                            formData.append('NameType[]', name);
                        }
                    }

                    formData.append('type', type);
                    formData.append('id', res.data.result.project.id);
                    await axios.post('/api/vendor/project-vendor/upload-file', formData, {
                        headers: {
                            'Content-Type': 'multipart/form-data',
                            Accept: 'application/json',
                            Authorization: `Bearer ${token}`,
                        },
                    });

                    setTimeout(() => {
                        setProjectType('');
                        setData({
                            idProject: '',
                            PONum: '',
                            BAType: '',
                            ProjectName: '',
                            VendorName: '',
                            ProjectValue: '',
                            ProgressValue: '',
                            WorkProgressPercent: '',
                            PICName: '',
                            PICPosition: '',
                            PICAddress: '',
                            PICIdCardNo: '',
                            worksheet_projects: [],
                        });
                        setOpen(false);
                        toast.success(res.data.meta.message);
                        setIsLoading(false);
                    }, 1000);
                    if (refreshFunction) refreshFunction();
                }
            }
        }
    };

    // console.log(appSCurvedFile);
    // console.log(dokumenScan);
    // console.log(dokumentasiProgress);
    // console.log(rincianProgress);
    // console.log(otherDokumen);

    const handleOpen = () => {
        setData({
            idProject: '',
            PONum: '',
            BAType: '',
            ProjectName: '',
            VendorName: '',
            ProjectValue: '',
            ProgressValue: '',
            WorkProgressPercent: '',
            PICName: '',
            PICPosition: '',
            PICAddress: '',
            PICIdCardNo: '',
            upload_file: [],
            worksheet_projects: [],
        });
        !open && setOpen(true);
    };

    return (
        <Dialog open={open} onOpenChange={handleOpen}>
            <DialogTrigger asChild>
                <Button variant="orange" size="lg">
                    <IconPlus className="size-4" />
                    Tambah
                </Button>
            </DialogTrigger>
            <DialogContent
                className="sm:max-w-7xl h-full max-h-screen overflow-y-auto"
                handleCloseDialog={handleCloseDialog}
            >
                <DialogHeader>
                    <DialogTitle className="text-lg">Tambah Berita Acara</DialogTitle>
                </DialogHeader>

                <Separator className="my-2" />
                <div className="flex flex-col gap-4 ">
                    <div className="flex items-center space-x-2">
                        <div className="grid lg:grid-cols-2 gap-4 w-full">
                            <div className="grid flex-1 gap-2">
                                <Label required htmlFor="PONum" className="text-[12px]">
                                    PO No
                                </Label>
                                <div className="flex flex-row justify-normal gap-2">
                                    <ComboBox
                                        items={projects}
                                        selectedItem={data.PONum}
                                        onSelect={(value) => {
                                            fetchProject(value);
                                        }}
                                    />
                                    <Button variant="outline" onClick={() => fetchTermSheet(data.idProject)}>
                                        <IconSearch /> TermSheet
                                    </Button>
                                </div>
                                {errors.PONum && <span className="text-red-500 text-[11px]">{errors.PONum}</span>}
                            </div>
                            <div className="grid flex-1 gap-2">
                                <Label required htmlFor="BAType" className="text-[12px]">
                                    BA Type
                                </Label>
                                <ComboBox
                                    items={ba_types}
                                    selectedItem={data.BAType}
                                    onSelect={(value) => setData('BAType', value)}
                                />
                                {errors.BAType && <span className="text-red-500 text-[11px]">{errors.BAType}</span>}
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center space-x-2">
                        <div className="grid lg:grid-cols-2 gap-4 w-full">
                            <div className="grid flex-1 gap-2">
                                <Label htmlFor="ProjectName" className="text-[12px]">
                                    Project Name
                                </Label>
                                <Input
                                    id="ProjectName"
                                    type="text"
                                    name="ProjectName"
                                    value={data.ProjectName}
                                    className="mt-1 block w-full disabled:opacity-70 disabled:bg-gray-50"
                                    disabled={true}
                                />
                            </div>
                            <div className="grid flex-1 gap-2">
                                <Label htmlFor="VendorName" className="text-[12px]">
                                    Vendor Name
                                </Label>
                                <Input
                                    id="VendorName"
                                    type="text"
                                    name="VendorName"
                                    value={data.VendorName}
                                    className="mt-1 block w-full disabled:opacity-70 disabled:bg-gray-50"
                                    disabled={true}
                                />
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center space-x-2">
                        <div className="grid lg:grid-cols-2 gap-4 w-full">
                            <div className="grid flex-1 gap-2">
                                <Label htmlFor="ProjectValue" className="text-[12px]">
                                    Project Value
                                </Label>
                                <Input
                                    id="ProjectValue"
                                    type="text"
                                    name="ProjectValue"
                                    value={formatRupiah(data.ProjectValue)}
                                    className="mt-1 block w-full disabled:opacity-70 disabled:bg-gray-50"
                                    disabled={true}
                                    // isFocused={true}
                                    onChange={(e) => {
                                        const numericValue = parseFloat(e.target.value.replace(/[^\d]/g, '')) || 0;
                                        setData(e.target.name, numericValue);
                                    }}
                                />
                            </div>
                            <div className="grid flex-1 gap-2">
                                <Label required htmlFor="Company" className="text-[12px]">
                                    Company
                                </Label>

                                <ComboBox
                                    items={companies}
                                    selectedItem={data.Company}
                                    onSelect={(value) => setData('Company', value)}
                                />
                                {errors.Company && <span className="text-red-500 text-[11px]">{errors.Company}</span>}
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center space-x-2">
                        <div className="grid lg:grid-cols-2 gap-4 w-full">
                            <div className="grid flex-1 gap-2">
                                <Label required htmlFor="ProgressValue" className="text-[12px]">
                                    Progress Value
                                </Label>
                                <Input
                                    id="ProgressValue"
                                    type="text"
                                    name="ProgressValue"
                                    value={formatRupiah(data.ProgressValue || 0)}
                                    className="mt-1 block w-full"
                                    // isFocused={true}
                                    onChange={(e) => {
                                        const numericValue = parseFloat(e.target.value.replace(/[^\d]/g, '')) || 0;
                                        setData(e.target.name, numericValue);
                                    }}
                                />
                                {errors.ProgressValue && (
                                    <span className="text-red-500 text-[11px]">{errors.ProgressValue}</span>
                                )}
                            </div>
                            <div className="grid flex-1 gap-2">
                                <Label required htmlFor="WorkProgressPercent" className="text-[12px]">
                                    Progress Work
                                </Label>
                                <div className="flex items-center gap-4">
                                    <Input
                                        id="WorkProgressPercent"
                                        type="text"
                                        name="WorkProgressPercent"
                                        value={data.WorkProgressPercent}
                                        className="mt-1 block w-full"
                                        // isFocused={true}
                                        onChange={(e) => {
                                            setData(e.target.name, e.target.value);
                                        }}
                                        placeholder="example 80.4 or 80"
                                    />
                                    <span className="text-[12px] text-muted-foreground">% (percent)</span>
                                </div>
                                {errors.WorkProgressPercent && (
                                    <span className="text-red-500 text-[11px]">{errors.WorkProgressPercent}</span>
                                )}
                            </div>
                        </div>
                    </div>

                    <div>
                        <Separator className="my-2" />
                        <h1 className="font-bold">PIC</h1>
                        <Separator className="my-2" />
                    </div>
                    <div className="flex items-center space-x-2">
                        <div className="grid lg:grid-cols-2 gap-4 w-full">
                            <div className="grid flex-1 gap-2">
                                <Label required htmlFor="PICName" className="text-[12px]">
                                    Nama
                                </Label>
                                <Input
                                    id="PICName"
                                    type="text"
                                    name="PICName"
                                    value={data.PICName}
                                    className="mt-1 block w-full"
                                    // isFocused={true}
                                    onChange={(e) => {
                                        setData(e.target.name, e.target.value);
                                    }}
                                />
                                {errors.PICName && <span className="text-red-500 text-[11px]">{errors.PICName}</span>}
                            </div>
                            <div className="grid flex-1 gap-2">
                                <Label required htmlFor="PICPosition" className="text-[12px]">
                                    Position
                                </Label>
                                <Input
                                    id="PICPosition"
                                    type="text"
                                    name="PICPosition"
                                    value={data.PICPosition}
                                    className="mt-1 block w-full"
                                    // isFocused={true}
                                    onChange={(e) => {
                                        setData(e.target.name, e.target.value);
                                    }}
                                />
                                {errors.PICPosition && (
                                    <span className="text-red-500 text-[11px]">{errors.PICPosition}</span>
                                )}
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center space-x-2">
                        <div className="grid lg:grid-cols-2 gap-4 w-full">
                            <div className="grid flex-1 gap-2">
                                <Label required htmlFor="PICIdCardNo" className="text-[12px]">
                                    Id Card No
                                </Label>
                                <Input
                                    id="PICIdCardNo"
                                    type="text"
                                    name="PICIdCardNo"
                                    value={data.PICIdCardNo}
                                    className="mt-1 block w-full"
                                    // isFocused={true}
                                    onChange={(e) => {
                                        setData(e.target.name, e.target.value);
                                    }}
                                />
                                {errors.PICIdCardNo && (
                                    <span className="text-red-500 text-[11px]">{errors.PICIdCardNo}</span>
                                )}
                            </div>
                            <div className="grid flex-1 gap-2">
                                <Label required htmlFor="PICAddress" className="text-[12px]">
                                    Address
                                </Label>
                                <Input
                                    id="PICAddress"
                                    type="text"
                                    name="PICAddress"
                                    value={data.PICAddress}
                                    className="mt-1 block w-full"
                                    // isFocused={true}
                                    onChange={(e) => {
                                        setData(e.target.name, e.target.value);
                                    }}
                                />
                                {errors.PICAddress && (
                                    <span className="text-red-500 text-[11px]">{errors.PICAddress}</span>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
                <Separator className="my-2" />
                <div>
                    <h1 className="font-bold">TermSheet</h1>
                    <DynamicTable
                        closeModal={closeModal}
                        setData={setData}
                        data={data}
                        handleCloseDialog={handleCloseDialog}
                    />
                    {/* <DynamicTable setData={setData} data={data} units={units} errors={errors} /> */}
                </div>
                <Separator className="my-2" />
                <div className="flex flex-col gap-4">
                    <h1 className="font-bold">Attachment</h1>

                    <div className="flex flex-col items-center space-x-2 gap-4">
                        {project_type === 'Project' && (
                            <div className="grid lg:grid-cols-2 gap-4 w-full">
                                <div className="grid flex-1 gap-2">
                                    <Label htmlFor="ApprovedSCurved" className="text-[12px]">
                                        Approved S Curved
                                    </Label>
                                    <Input
                                        type="file"
                                        name="appSCurvedFile"
                                        className="mt-1 block w-full"
                                        onChange={handleUploadFile}
                                    />
                                    {/* {errors.PICIdCardNo && (
                                <span className="text-red-500 text-[11px]">{errors.PICIdCardNo}</span>
                            )} */}
                                </div>
                            </div>
                        )}
                        {project_type == 'Non Project' && (
                            <div className="grid lg:grid-cols-2 gap-4 w-full">
                                <div className="grid flex-1 gap-2">
                                    <Label htmlFor="DocAppBASurat" className="text-[12px]">
                                        Scan dokumen persetujuan/BA/Surat, sesuai termin{' '}
                                        <span className="text-red-500">( Max 5 MB )</span>
                                    </Label>
                                    <Input
                                        type="file"
                                        name="dokumenScan"
                                        className="mt-1 block w-full"
                                        onChange={handleUploadFile}
                                    />
                                    {/* {errors.PICIdCardNo && (
                                <span className="text-red-500 text-[11px]">{errors.PICIdCardNo}</span>
                            )} */}
                                </div>
                            </div>
                        )}
                        {project_type === 'Project' && (
                            <>
                                <div className="grid lg:grid-cols-2 gap-4 w-full">
                                    <div className="grid flex-1 gap-2">
                                        <Label htmlFor="DocAppBASurat" className="text-[12px]">
                                            Rincian Progress berdasarkan WBS yang telah ditandatangani oleh vendor
                                        </Label>
                                        <Input
                                            type="file"
                                            name="rincianProgress"
                                            className="mt-1 block w-full"
                                            onChange={handleUploadFile}
                                        />
                                        {/* {errors.PICIdCardNo && (
                                <span className="text-red-500 text-[11px]">{errors.PICIdCardNo}</span>
                            )} */}
                                    </div>
                                </div>
                                <div className="grid lg:grid-cols-2 gap-4 w-full">
                                    <div className="grid flex-1 gap-2">
                                        <Label htmlFor="DocAppBASurat" className="text-[12px]">
                                            Dokumentasi Progress <span className="text-red-500">( Max 5 MB )</span>
                                        </Label>
                                        <Input
                                            type="file"
                                            name="dokumentasiProgress"
                                            className="mt-1 block w-full"
                                            onChange={handleUploadFile}
                                        />
                                        {/* {errors.PICIdCardNo && (
                                <span className="text-red-500 text-[11px]">{errors.PICIdCardNo}</span>
                            )} */}
                                    </div>
                                </div>
                            </>
                        )}

                        {(project_type === 'Project' || project_type === 'Non Project') && (
                            <div className="grid lg:grid-cols-2 gap-4 w-full">
                                <div className="grid flex-1 gap-2">
                                    <Label htmlFor="DocAppBASurat" className="text-[12px]">
                                        Dokumen lain yang dipersyaratkan oleh User
                                    </Label>
                                    <Input
                                        type="file"
                                        name="otherDokumen"
                                        className="mt-1 block w-full"
                                        onChange={handleUploadFile}
                                    />
                                    {/* {errors.PICIdCardNo && (
                                <span className="text-red-500 text-[11px]">{errors.PICIdCardNo}</span>
                            )} */}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
                <div className="flex justify-end mt-4 gap-2">
                    <Button type="button" variant="secondary" onClick={handleCloseDialog}>
                        Cancel
                    </Button>
                    <Button type="button" disabled={isLoading} variant="default" onClick={() => handleSubmit('Draft')}>
                        Save as Draft
                    </Button>
                    <Button type="button" variant="orange" onClick={() => handleSubmit('Submit')}>
                        Submit For Approval
                    </Button>
                </div>
                <TermSheetModal
                    isModalOpen={isModalOpen}
                    closeModal={closeModal}
                    termSheet={termSheet}
                    setSelectedRows={setSelectedRows}
                    setData={setData}
                />
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
