import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Edit, Plus, Save, Trash2, X } from 'lucide-react';

import { Button } from '@/Components/ui/button';
import { Input } from '@/components/ui/input';
import { useState } from 'react';
import callAPI from '../../../config/callAPI';

const DynamicProjectTable = ({ setData, data, units, errors, refreshData }) => {
    const [columns] = useState(['#', 'Group', 'Project Desc', 'Target', 'Unit', 'Unit Price (Rp)', 'Actions']);
    const [rows, setRows] = useState(data.worksheet_projects || []);
    const [newRow, setNewRow] = useState(null);
    const [editingRow, setEditingRow] = useState(null);

    const handleInputChange = (eOrValue, field, isEditing = false) => {
        const targetState = isEditing ? editingRow : newRow;

        if (field === 'Unit') {
            // For Select, eOrValue is the selected value
            const updatedState = { ...targetState, [field]: eOrValue };
            isEditing ? setEditingRow(updatedState) : setNewRow(updatedState);
        } else if (field === 'UnitPriceRP') {
            // Handle numeric input for UnitPriceRP
            const inputValue = eOrValue.target.value.replace(/[^\d]/g, '');
            const numericValue = inputValue ? parseFloat(inputValue) : 0;

            const updatedState = { ...targetState, [field]: numericValue };
            isEditing ? setEditingRow(updatedState) : setNewRow(updatedState);
        } else {
            // For other fields
            const updatedState = {
                ...targetState,
                [field]: eOrValue.target.value,
            };
            isEditing ? setEditingRow(updatedState) : setNewRow(updatedState);
        }
    };

    const startAddingNewRow = () => {
        setNewRow({
            id: Date.now(), // Unique identifier
            JobGroup: '',
            JobDescription: '',
            Target: '',
            Unit: '',
            UnitPriceRP: 0,
        });
    };

    const saveNewRow = () => {
        if (newRow && newRow.JobGroup && newRow.JobDescription && newRow.Target && newRow.Unit) {
            setRows([...rows, newRow]);
            setData('worksheet_projects', [...rows, newRow]);
            setNewRow(null);
        }
    };

    const cancelNewRow = () => {
        setNewRow(null);
    };

    const startEditingRow = (row) => {
        setEditingRow({ ...row });
    };

    const saveEditedRow = () => {
        if (editingRow) {
            setRows(rows.map((row) => (row.id === editingRow.id ? editingRow : row)));
            setEditingRow(null);
        }
    };

    const cancelEditRow = () => {
        setEditingRow(null);
    };

    const deteleRowWorksheet = (rowId) => {
        const url = '/api/ami/project/' + rowId + '/worksheet-project/destroy';

        return callAPI({
            url,
            method: 'DELETE',
            token: true,
        });
    };

    const deleteRow = async (rowId) => {
        const res = await deteleRowWorksheet(rowId);
        console.log(res);
        if (res.data.meta.code === 200) {
            setRows(rows.filter((row) => row.id !== rowId));
            // toast.success(res.data.meta.message);

            // if(refreshData)
            // {
            //     refreshData()
            // }
        }
    };

    const formatCurrency = (value) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(value);
    };

    return (
        <div className="w-full">
            <table className="w-full border-collapse">
                <thead>
                    <tr className="bg-green-500">
                        {columns.map((column) => (
                            <th key={column} className="border p-2 text-left text-sm">
                                {column}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {rows.map((row, index) => (
                        <tr key={row.id} className="hover:bg-gray-50">
                            <td className="border p-2">{index + 1}</td>
                            {editingRow && editingRow.id === row.id ? (
                                <>
                                    <td className="border p-2">
                                        <Input
                                            className="w-full h-9 border rounded"
                                            value={editingRow.JobGroup}
                                            onChange={(e) => handleInputChange(e, 'JobGroup', true)}
                                            placeholder="Group"
                                        />
                                    </td>
                                    <td className="border p-2">
                                        <Input
                                            className="w-full h-9 border rounded"
                                            value={editingRow.JobDescription}
                                            onChange={(e) => handleInputChange(e, 'JobDescription', true)}
                                            placeholder="Project Description"
                                        />
                                    </td>
                                    <td className="border p-2">
                                        <Input
                                            className="w-full h-9 border rounded"
                                            value={editingRow.Target}
                                            onChange={(e) => handleInputChange(e, 'Target', true)}
                                            placeholder="Target"
                                        />
                                    </td>
                                    <td className="border p-2">
                                        <Select
                                            value={editingRow.Unit}
                                            onValueChange={(value) => handleInputChange(value, 'Unit')}
                                        >
                                            <SelectTrigger className="px-6 h-9">
                                                <SelectValue placeholder="Select Unit" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {units.map((unit) => (
                                                    <SelectItem key={unit.value} value={unit.value}>
                                                        {unit.label}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </td>
                                    <td className="border p-2">
                                        <Input
                                            className="w-full p-2 border rounded"
                                            value={editingRow.UnitPriceRP}
                                            onChange={(e) => handleInputChange(e, 'UnitPriceRP', true)}
                                            placeholder="Unit Price"
                                        />
                                    </td>
                                    <td className="border p-2">
                                        <div className="flex space-x-2">
                                            <Button variant="outline" onClick={saveEditedRow}>
                                                <Save className="h-4 w-4" />
                                            </Button>
                                            <Button variant="outline" onClick={cancelEditRow}>
                                                <X className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </td>
                                </>
                            ) : (
                                <>
                                    <td className="border p-2 text-[13px]">{row.JobGroup}</td>
                                    <td className="border p-2 text-[13px]">{row.JobDescription}</td>
                                    <td className="border p-2 text-[13px]">{row.Target}</td>
                                    <td className="border p-2 text-[13px]">{row.Unit}</td>
                                    <td className="border p-2 text-[13px]">{formatCurrency(row.UnitPriceRP)}</td>
                                    <td className="border p-2 text-[13px]">
                                        <div className="flex space-x-2">
                                            <Button variant="outline" onClick={() => startEditingRow(row)}>
                                                <Edit className="h-4 w-4" />
                                            </Button>
                                            <Button variant="outline" onClick={() => deleteRow(row.id)}>
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </td>
                                </>
                            )}
                        </tr>
                    ))}

                    {newRow && (
                        <tr>
                            <td className="border p-2">{rows.length + 1}</td>
                            <td className="border p-2">
                                <Input
                                    className="w-full p-2 h-9 border rounded"
                                    value={newRow.JobGroup}
                                    onChange={(e) => handleInputChange(e, 'JobGroup')}
                                    placeholder="Group"
                                />
                            </td>
                            <td className="border p-2">
                                <Input
                                    className="w-full p-2 h-9 border rounded"
                                    value={newRow.JobDescription}
                                    onChange={(e) => handleInputChange(e, 'JobDescription')}
                                    placeholder="Project Description"
                                />
                            </td>
                            <td className="border p-2">
                                <Input
                                    className="w-full p-2 h-9 border rounded"
                                    value={newRow.Target}
                                    onChange={(e) => handleInputChange(e, 'Target')}
                                    placeholder="Target"
                                />
                            </td>
                            <td className="border p-2">
                                <Select value={newRow.Unit} onValueChange={(value) => handleInputChange(value, 'Unit')}>
                                    <SelectTrigger className="px-6 h-9">
                                        <SelectValue placeholder="Select Unit" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {units.map((unit) => (
                                            <SelectItem key={unit.value} value={unit.value}>
                                                {unit.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </td>
                            <td className="border p-2">
                                <Input
                                    className="w-full p-2 h-9 border rounded"
                                    value={newRow.UnitPriceRP}
                                    onChange={(e) => handleInputChange(e, 'UnitPriceRP')}
                                    placeholder="Unit Price"
                                />
                            </td>
                            <td className="border p-2">
                                <div className="flex space-x-2">
                                    <Button variant="outline" onClick={saveNewRow}>
                                        <Save className="h-4 w-4" />
                                    </Button>
                                    <Button variant="outline" onClick={cancelNewRow}>
                                        <X className="h-4 w-4" />
                                    </Button>
                                </div>
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>

            {!newRow && (
                <div className="mt-4">
                    <Button variant="blue" onClick={startAddingNewRow}>
                        <Plus className="mr-2 h-4 w-4" /> Add New Row
                    </Button>
                </div>
            )}
        </div>
    );
};

export default DynamicProjectTable;
