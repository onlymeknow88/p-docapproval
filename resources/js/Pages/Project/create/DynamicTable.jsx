import { Pencil, Plus, Save, Trash2, X } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useState } from 'react';

const DynamicTable = ({ setData, data, units, errors }) => {
    const [columns] = useState(['#', 'Group', 'Project Desc', 'Target', 'Unit', 'Unit Price (Rp)', 'Actions']);
    const [rows, setRows] = useState([]);
    const [newRow, setNewRow] = useState(null);
    const [editingRow, setEditingRow] = useState(null);

    // Units for dropdown
    //   const unitOptions = ['Kg', 'Liter', 'Meter', 'Piece', 'Box'];

    const handleInputChange = (eOrValue, field, isEditing = false) => {
        const targetState = isEditing ? editingRow : newRow;

        if (field === 'Unit') {
            // For ComboBox, eOrValue is the selected value
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
        if (newRow) {
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

    const deleteRow = (rowId) => {
        setRows(rows.filter((row) => row.id !== rowId));
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
        <div className="w-full overflow-x-auto">
            <table className="w-full border-collapse">
                <thead>
                    <tr className="bg-green-500">
                        {columns.map((column, index) => (
                            <th key={index} className="border p-2 text-left text-sm font-semibold">
                                {column}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {rows.map((row, index) =>
                        editingRow && editingRow.id === row.id ? (
                            <tr key={row.id} className="hover:bg-gray-50">
                                <td className="border p-2">{index + 1}</td>
                                <td className="border p-2">
                                    <Input
                                        value={editingRow.JobGroup || ''}
                                        onChange={(e) => handleInputChange(e, 'JobGroup', true)}
                                        placeholder="JobGroup"
                                    />
                                </td>
                                <td className="border p-2">
                                    <Input
                                        value={editingRow.JobDescription || ''}
                                        onChange={(e) => handleInputChange(e, 'JobDescription', true)}
                                        placeholder="Project Description"
                                    />
                                </td>
                                <td className="border p-2">
                                    <Input
                                        value={editingRow.Target || ''}
                                        onChange={(e) => handleInputChange(e, 'Target', true)}
                                        placeholder="Target"
                                    />
                                </td>
                                <td className="border p-2">
                                    <Select
                                        value={editingRow.Unit || ''}
                                        onValueChange={(value) => handleInputChange(value, 'Unit', true)}
                                    >
                                        <SelectTrigger>
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
                                        value={editingRow.UnitPriceRP || 0}
                                        onChange={(e) => handleInputChange(e, 'UnitPriceRP', true)}
                                        placeholder="Unit Price"
                                    />
                                </td>
                                <td className="border p-2">
                                    <div className="flex space-x-2">
                                        <Button variant="outline" size="icon" onClick={saveEditedRow}>
                                            <Save className="h-4 w-4" />
                                        </Button>
                                        <Button variant="outline" size="icon" onClick={cancelEditRow}>
                                            <X className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </td>
                            </tr>
                        ) : (
                            <tr key={row.id} className="hover:bg-gray-100">
                                <td className="border p-2 text-[13px]">{index + 1}</td>
                                <td className="border p-2 text-[13px]">{row.JobGroup}</td>
                                <td className="border p-2 text-[13px]">{row.JobDescription}</td>
                                <td className="border p-2 text-[13px]">{row.Target}</td>
                                <td className="border p-2 text-[13px]">{row.Unit}</td>
                                <td className="border p-2 text-[13px]">{formatCurrency(row.UnitPriceRP)}</td>
                                <td className="border p-2 text-[13px]">
                                    <div className="flex space-x-2">
                                        <Button variant="outline" size="icon" onClick={() => startEditingRow(row)}>
                                            <Pencil className="h-4 w-4" />
                                        </Button>
                                        <Button variant="outline" size="icon" onClick={() => deleteRow(row.id)}>
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </td>
                            </tr>
                        ),
                    )}

                    {/* New Row Input */}
                    {newRow && (
                        <tr className="bg-gray-50">
                            <td className="border p-2">{rows.length + 1}</td>
                            <td className="border p-2">
                                <Input
                                className="w-full p-2 h-9 border rounded"
                                    value={newRow.JobGroup || ''}
                                    onChange={(e) => handleInputChange(e, 'JobGroup')}
                                    placeholder="Group"
                                />
                            </td>
                            <td className="border p-2">
                                <Input
                                className="w-full p-2 h-9 border rounded"
                                    value={newRow.JobDescription || ''}
                                    onChange={(e) => handleInputChange(e, 'JobDescription')}
                                    placeholder="Project Description"
                                />
                            </td>
                            <td className="border p-2">
                                <Input
                                className="w-full p-2 h-9 border rounded"
                                    value={newRow.Target || ''}
                                    onChange={(e) => handleInputChange(e, 'Target')}
                                    placeholder="Target"
                                />
                            </td>
                            <td className="border p-2">
                                <Select
                                    value={newRow.Unit || ''}
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
                                className="w-full p-2 h-9 border rounded"
                                    value={newRow.UnitPriceRP || 0}
                                    onChange={(e) => handleInputChange(e, 'UnitPriceRP')}
                                    placeholder="Unit Price"
                                />
                            </td>
                            <td className="border p-2">
                                <div className="flex space-x-2">
                                    <Button variant="outline" size="icon" onClick={saveNewRow}>
                                        <Save className="h-4 w-4" />
                                    </Button>
                                    <Button variant="outline" size="icon" onClick={cancelNewRow}>
                                        <X className="h-4 w-4" />
                                    </Button>
                                </div>
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>

            {/* Add New Row Button */}
            <div className="mt-4">
                <Button variant="blue" onClick={startAddingNewRow} disabled={!!newRow || !!editingRow}>
                    <Plus className="mr-2 h-4 w-4" /> Add New Row
                </Button>
            </div>
        </div>
    );
};

export default DynamicTable;
