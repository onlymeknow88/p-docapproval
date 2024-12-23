import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

import { MultiSelect } from '@/Components/MultiSelect';
import { Button } from '@/Components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import callAPI from '@/config/callAPI';
import { useForm } from '@inertiajs/react';
import { IconPencil } from '@tabler/icons-react';
import { useState } from 'react';
import { toast } from 'sonner';

export default function Edit({ row, refreshData }) {
    const { data, setData } = useForm({
        CompanyId: row?.CompanyId || '',
        DeptId: row?.DeptId || '',
        Name: row?.Name || '',
        Email: row?.Email || '',
        Position: row?.Position || '',
        Checker: row?.Checker.split('; ').map((item) => item.trim()) || '',
    });

    const options = [
        { value: 'a@a.com', label: 'a@a.com' },
        { value: 'b@b.com', label: 'b@b.com' },
    ];

    const handleMultiSelectChange = (selectedValues) => {
        console.log('Selected values:', selectedValues);
        setData('Checker', selectedValues);
    };

    const handleSelectChange = (field) => (selectedValue) => {
        setData(field, selectedValue);
    };

    const [open, setOpen] = useState(false);

    const [refreshFunction, setRefreshFunction] = useState(null);

    function updateData() {
        const url = '/api/admin/orchart-approval/' + row?.id;

        return callAPI({
            url,
            method: 'POST',
            token: true,
            data: data,
        });
    }

    const [errors, setErrors] = useState({});

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
        setData({
            CompanyId: row?.CompanyId || '',
            DeptId: row?.DeptId || '',
            Name: row?.Name || '',
            Email: row?.Email || '',
            Position: row?.Position || '',
            Checker: row?.Checker.split('; ').map((item) => item.trim()) || '',
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
                        <DialogTitle>Update Orchart Approval</DialogTitle>
                    </DialogHeader>

                    <div className="grid gap-4">
                        <div className="flex items-center space-x-2">
                            <div className="grid flex-1 gap-2">
                                <Label htmlFor="companyid">Company</Label>
                                <Select value={data.CompanyId} onValueChange={handleSelectChange('CompanyId')}>
                                    <SelectTrigger>
                                        <SelectValue className="text-muted-foreground" placeholder="Pilih" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectGroup>
                                            <SelectItem value="MC">Maruwai Coal</SelectItem>
                                            <SelectItem value="LC">Lahai Coal</SelectItem>
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <div className="flex items-center space-x-2">
                            <div className="grid flex-1 gap-2">
                                <Label htmlFor="deptid">Department</Label>
                                <Select value={data.DeptId} onValueChange={handleSelectChange('DeptId')}>
                                    <SelectTrigger>
                                        <SelectValue className="text-muted-foreground" placeholder="Pilih" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectGroup>
                                            <SelectItem value="Env">Environment</SelectItem>
                                            <SelectItem value="Ohs">Ohs</SelectItem>
                                            <SelectItem value="PLA">Plant</SelectItem>
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <div className="flex items-center space-x-2">
                            <div className="grid flex-1 gap-2">
                                <Label htmlFor="name">Name</Label>
                                <Input
                                    id="Name"
                                    type="text"
                                    name="Name"
                                    value={data.Name}
                                    className="mt-1 block w-full"
                                    // isFocused={true}
                                    onChange={(e) => setData(e.target.name, e.target.value)}
                                />
                                {errors.Name && <span className="text-red-500 text-sm">{errors.Name}</span>}
                            </div>
                        </div>
                        <div className="flex items-center space-x-2">
                            <div className="grid flex-1 gap-2">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="Email"
                                    type="email"
                                    name="Email"
                                    value={data.Email}
                                    className="mt-1 block w-full"
                                    // isFocused={true}
                                    onChange={(e) => setData(e.target.name, e.target.value)}
                                />
                                {errors.Email && <span className="text-red-500 text-sm">{errors.Email}</span>}
                            </div>
                        </div>
                        <div className="flex items-center space-x-2">
                            <div className="grid flex-1 gap-2">
                                <Label htmlFor="position">Position</Label>
                                <Select value={data.Position} onValueChange={handleSelectChange('Position')}>
                                    <SelectTrigger>
                                        <SelectValue className="text-muted-foreground" placeholder="Pilih" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectGroup>
                                            <SelectItem value="Director">Director</SelectItem>
                                            <SelectItem value="DivHead">Division Head</SelectItem>
                                            <SelectItem value="DeptHead">Department Head</SelectItem>
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <div className="flex items-center space-x-2">
                            <div className="grid flex-1 gap-2">
                                <Label htmlFor="checker">Checker</Label>
                                <MultiSelect
                                    options={options}
                                    onValueChange={handleMultiSelectChange}
                                    defaultValue={data.Checker}
                                    placeholder="Pilih"
                                    animation={0.3}
                                    maxCount={2}
                                    variant="default"
                                    modalPopover={false}
                                />
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
