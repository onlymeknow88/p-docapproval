import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useForm, usePage } from '@inertiajs/react';
import { IconPencil, IconSearch } from '@tabler/icons-react';

import ComboBox from '@/Components/ComboBox';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/Components/ui/separator';
import { formatRupiah } from '@/lib/utils';
import axios from 'axios';
import { X } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import callAPI from '../../../config/callAPI';
import DynamicTable from './DynamicTable';
import TermSheetModal from './TermSheetModal';

export default function edit({ id, row, refreshFunction }) {
    const props = usePage().props;

    const { data: projects } = props.projects;
    const ba_types = props.ba_types;
    const companies = props.companies;
    const [isLoading, setIsLoading] = useState(false);
    const user = atob(sessionStorage.getItem('user'));

    const filteredProjects = projects.filter((project) => project.VendorId === user);

    const convertedDataProject = filteredProjects.map((item) => ({
        value: item.PONum,
        label: item.PONum,
    }));

    const convertedDataBAType = ba_types.map((item) => ({
        value: item.Value,
        label: item.Text,
    }));

    const convertedDataCompany = companies.map((item) => ({
        value: item.Value,
        label: item.Text,
    }));

    const [errors, setErrors] = useState({});

    const docNum = (docNum) => {
        return docNum.split('/')[0];
    };

    const [open, setOpen] = useState(false);
    const { data, setData } = useForm({
        idBeritaAcara: row.id,
        idProject: row.project_id || '',
        Company: docNum(row.DocNum) || '',
        PONum: row.PONum || '',
        BAType: row.BAType || '',
        ProjectType: row.ProjectType || '',
        ProjectName: row.ProjectName || '',
        VendorName: row.VendorName || '',
        ProjectValue: row.ProjectValue || '',
        ProgressValue: row.ProgressValue || '',
        WorkProgressPercent: row.WorkProgressPercent || '',
        PICName: row.PICName || '',
        PICPosition: row.PICPosition || '',
        PICAddress: row.PICAddress || '',
        PICIdCardNo: row.PICIdCardNo || '',
        worksheet_projects: [],
        worksheet_bas: row.worksheet_ba || [],
        attachments: row.attachments || [],
    });

    console.log(data);

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
            idBeritaAcara: row.id,
            idProject: row.project_id || '',
            Company: docNum(row.DocNum) || '',
            PONum: row.PONum || '',
            BAType: row.BAType || '',
            ProjectType: row.ProjectType || '',
            ProjectName: row.ProjectName || '',
            VendorName: row.VendorName || '',
            ProjectValue: row.ProjectValue || '',
            ProgressValue: row.ProgressValue || '',
            WorkProgressPercent: row.WorkProgressPercent || '',
            PICName: row.PICName || '',
            PICPosition: row.PICPosition || '',
            PICAddress: row.PICAddress || '',
            PICIdCardNo: row.PICIdCardNo || '',
            worksheet_projects: [],
            worksheet_bas: row.worksheet_ba || [],
            attachments: row.attachments || [],
        });

        setOpen(false);
    };

    function updateData(type) {
        const url = '/api/vendor/project-vendor/' + row?.id + '?type=' + type;

        return callAPI({
            url,
            method: 'POST',
            token: true,
            data: data,
        });
    }

    function draftApp(type) {
        const url = '/api/vendor/project-vendor/' + row?.id + '?type=' + type;

        return callAPI({
            url,
            method: 'POST',
            token: true,
            data: data,
        });
    }

    const handleSubmit = async (type) => {
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
            console.log(res);

            if (res.error) {
                setErrors(res.data);
                toast.error('Failed Update Check Form Input');
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
                    const resUploadFile = await axios.post('/api/vendor/project-vendor/upload-file', formData, {
                        headers: {
                            'Content-Type': 'multipart/form-data',
                            Accept: 'application/json',
                            Authorization: `Bearer ${token}`,
                        },
                    });

                    const uploadedFiles = resUploadFile.data.result;

                    setAttachments((prevAttachments) => [
                        ...prevAttachments,
                        ...uploadedFiles.map((file) => ({
                            id: file.id,
                            NameType: file.NameType,
                            AttchName: file.AttchName,
                            UrlPath: file.UrlPath,
                        })),
                    ]);
                    setTimeout(() => {
                        setProjectType('');
                        setAppSCurvedFile(null);
                        setDokumenScan(null);
                        setDokumentasiProgress(null);
                        setRincianProgress(null);
                        setOtherDokumen(null);
                        setOpen(false);
                        toast.success(res.data.meta.message);
                        // setIsLoading(false)
                    }, 1000);
                    if (refreshFunction) refreshFunction();
                }
            }
        } else if (type === 'Submit') {
            const res = await updateData(type);

            if (res.error) {
                setErrors(res.data);
                toast.error('Failed Update Check Form Input');
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
                    const resUploadFile = await axios.post('/api/vendor/project-vendor/upload-file', formData, {
                        headers: {
                            'Content-Type': 'multipart/form-data',
                            Accept: 'application/json',
                            Authorization: `Bearer ${token}`,
                        },
                    });

                    const uploadedFiles = resUploadFile.data.result;

                    setAttachments((prevAttachments) => [
                        ...prevAttachments,
                        ...uploadedFiles.map((file) => ({
                            id: file.id,
                            NameType: file.NameType,
                            AttchName: file.AttchName,
                            UrlPath: file.UrlPath,
                        })),
                    ]);
                    setTimeout(() => {
                        setProjectType('');
                        setAppSCurvedFile(null);
                        setDokumenScan(null);
                        setDokumentasiProgress(null);
                        setRincianProgress(null);
                        setOtherDokumen(null);
                        setOpen(false);
                        toast.success(res.data.meta.message);
                        // setIsLoading(false)
                    }, 1000);
                    if (refreshFunction) refreshFunction();
                }
            }
        }
    };

    const [appSCurvedFile, setAppSCurvedFile] = useState(null);
    const [dokumenScan, setDokumenScan] = useState(null);
    const [dokumentasiProgress, setDokumentasiProgress] = useState(null);
    const [rincianProgress, setRincianProgress] = useState(null);
    const [otherDokumen, setOtherDokumen] = useState(null);

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

    const [deletedTypes, setDeletedTypes] = useState(new Set());

    const [attachments, setAttachments] = useState(data.attachments || []);

    function deleteFile(id) {
        const url = '/api/vendor/project-vendor/delete-file/' + id;

        return callAPI({
            url,
            method: 'DELETE',
            token: true,
        });
    }
    const handleDelete = async (nameType, id) => {
        const res = await deleteFile(id);

        if (res.data.meta.code === 200) {
            const updatedAttachments = attachments.filter((item) => item.NameType !== nameType);
            setAttachments(updatedAttachments);

            setDeletedTypes((prev) => {
                const newSet = new Set(prev);
                newSet.add(nameType); // Add the name type to the set
                return newSet;
            });
        }
    };

    const isDeleted = (nameType) => deletedTypes.has(nameType);

    return (
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

                <Separator className="my-2" />
                <div className="flex flex-col gap-4 ">
                    <div className="flex items-center space-x-2">
                        <div className="grid lg:grid-cols-2 gap-4 w-full">
                            <div className="grid flex-1 gap-2">
                                <Label htmlFor="PONum" className="text-[12px]">
                                    PO No
                                </Label>
                                <div className="flex flex-row justify-normal gap-2">
                                    <ComboBox
                                        items={convertedDataProject}
                                        selectedItem={data.PONum}
                                        onSelect={(value) => {
                                            fetchProject(value);
                                        }}
                                    />
                                    <Button variant="outline" onClick={() => fetchTermSheet(data.idProject)}>
                                        <IconSearch /> TermSheet
                                    </Button>
                                </div>
                            </div>
                            <div className="grid flex-1 gap-2">
                                <Label htmlFor="BAType" className="text-[12px]">
                                    BA Type
                                </Label>
                                <ComboBox
                                    items={convertedDataBAType}
                                    selectedItem={data.BAType}
                                    onSelect={(value) => setData('BAType', value)}
                                />
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
                                    // isFocused={true}
                                    // onChange={(e) => setData(e.target.name, e.target.value)}
                                />
                                {/* {errors.ProjectName && <span className="text-red-500 text-sm">{errors.ProjectName}</span>} */}
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
                                    // isFocused={true}
                                    // onChange={(e) => {
                                    //     const numericValue = parseFloat(e.target.value.replace(/[^\d]/g, '')) || 0;
                                    //     setData(e.target.name, numericValue);
                                    // }}
                                />
                                {/* {errors.ProjectName && <span className="text-red-500 text-sm">{errors.ProjectName}</span>} */}
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
                                {/* {errors.ProjectName && <span className="text-red-500 text-sm">{errors.ProjectName}</span>} */}
                            </div>
                            <div className="grid flex-1 gap-2">
                                <Label htmlFor="Company" className="text-[12px]">
                                    Company
                                </Label>
                                <ComboBox
                                    items={convertedDataCompany}
                                    selectedItem={data.Company}
                                    onSelect={(value) => setData('Company', value)}
                                />
                                {/* {errors.ProjectName && <span className="text-red-500 text-sm">{errors.ProjectName}</span>} */}
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center space-x-2">
                        <div className="grid lg:grid-cols-2 gap-4 w-full">
                            <div className="grid flex-1 gap-2">
                                <Label htmlFor="ProgressValue" className="text-[12px]">
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
                                {/* {errors.ProjectName && <span className="text-red-500 text-sm">{errors.ProjectName}</span>} */}
                            </div>
                            <div className="grid flex-1 gap-2">
                                <Label htmlFor="WorkProgressPercent" className="text-[12px]">
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
                                {/* {errors.ProjectName && <span className="text-red-500 text-sm">{errors.ProjectName}</span>} */}
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
                                <Label htmlFor="PICName" className="text-[12px]">
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
                                {/* {errors.ProjectName && <span className="text-red-500 text-sm">{errors.ProjectName}</span>} */}
                            </div>
                            <div className="grid flex-1 gap-2">
                                <Label htmlFor="PICPosition" className="text-[12px]">
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
                                {/* {errors.ProjectName && <span className="text-red-500 text-sm">{errors.ProjectName}</span>} */}
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center space-x-2">
                        <div className="grid lg:grid-cols-2 gap-4 w-full">
                            <div className="grid flex-1 gap-2">
                                <Label htmlFor="PICIdCardNo" className="text-[12px]">
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
                                {/* {errors.ProjectName && <span className="text-red-500 text-sm">{errors.ProjectName}</span>} */}
                            </div>
                            <div className="grid flex-1 gap-2">
                                <Label htmlFor="PICAddress" className="text-[12px]">
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
                                {/* {errors.ProjectName && <span className="text-red-500 text-sm">{errors.ProjectName}</span>} */}
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
                        worksheetBa={data.worksheet_bas}
                        handleCloseDialog={handleCloseDialog}
                    />
                    {/* <DynamicTable setData={setData} data={data} units={units} errors={errors} /> */}
                </div>
                <Separator className="my-2" />
                <div className="flex flex-col gap-4">
                    <h1 className="font-bold">Attachment</h1>

                    <div className="w-1/2">
                        <table className="border-collapse">
                            <thead>
                                <tr className="bg-green-500">
                                    <th className="border p-2 text-left text-sm">No</th>
                                    <th className="border p-2 text-left text-sm">Nama Dokumen</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                {attachments.map((item, index) => (
                                    <tr key={item.id || index}>
                                        <td className="border p-2 text-[13px] text-center">{index + 1}</td>
                                        <td className="border p-2 text-[13px]">
                                            <a className="underline text-blue-500" target="_blank" href={item.UrlPath}>
                                                {item.AttchName}
                                            </a>
                                        </td>
                                        <td className="border p-2 text-[13px]">
                                            <button
                                                className="bg-transparent"
                                                onClick={() => handleDelete(item.NameType, item.id)}
                                            >
                                                <X className="h-4 w-4 text-red-500" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div className="flex flex-col items-center space-x-2 gap-4">
                        {/* Approved S Curved */}
                        {(data.ProjectType === 'Project' || project_type === 'Project') && (
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
                                </div>
                            </div>
                        )}

                        {/* Scan dokumen persetujuan */}
                        {(data.ProjectType === 'Non Project' || project_type === 'Non Project') && (
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
                                </div>
                            </div>
                        )}

                        {(data.ProjectType === 'Project' || project_type === 'Project') && (
                            <>
                                <div className="grid lg:grid-cols-2 gap-4 w-full">
                                    <div className="grid flex-1 gap-2">
                                        <Label htmlFor="DocAppBASurat" className="text-[12px]">
                                            Dokumentasi Progress <span className="text-red-500">( Max 5 MB )</span>
                                        </Label>
                                        <Input
                                            type="file"
                                            name="rincianProgress"
                                            className="mt-1 block w-full"
                                            onChange={handleUploadFile}
                                        />
                                    </div>
                                </div>
                            </>
                        )}
                        {/* Dokumentasi Progress */}
                        {data.ProjectType === 'Project' && (
                            <>
                                <div className="grid lg:grid-cols-2 gap-4 w-full">
                                    <div className="grid flex-1 gap-2">
                                        <Label htmlFor="DocAppBASurat" className="text-[12px]">
                                            Rincian Progress berdasarkan WBS yang telah ditandatangani oleh vendor
                                        </Label>
                                        <Input
                                            type="file"
                                            name="dokumentasiProgress"
                                            className="mt-1 block w-full"
                                            onChange={handleUploadFile}
                                        />
                                    </div>
                                </div>
                            </>
                        )}

                        {/* Dokumen lain */}
                        {(data.ProjectType === 'Project' || data.ProjectType === 'Non Project') && (
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
                                </div>
                            </div>
                        )}
                    </div>
                </div>
                <div className="flex justify-end mt-4 gap-4">
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
                    worksheetBa={data.worksheet_bas}
                />
            </DialogContent>
        </Dialog>
    );
}
