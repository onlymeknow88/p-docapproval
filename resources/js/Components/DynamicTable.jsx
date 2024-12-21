import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input'; // Import from shadcn/ui
import { IconX } from '@tabler/icons-react';
import { useState } from 'react';

const DynamicTable = ({ columns }) => {
    // const [columns] = useState(['Column 1', 'Column 2', 'Actions']); // Fixed columns
    const [rows, setRows] = useState([]);
    const [newRow, setNewRow] = useState(null); // Tracks the new row being added

    const handleInputChange = (e, field) => {
        setNewRow({ ...newRow, [field]: e.target.value });
    };

    const saveNewRow = () => {
        setRows([...rows, { id: rows.length + 1, ...newRow }]); // Add new row
        setNewRow(null); // Clear the temporary row
    };

    const cancelNewRow = () => {
        setNewRow(null); // Clear the temporary row without saving
    };

    const deleteRow = (rowId) => {
        setRows(rows.filter((row) => row.id !== rowId)); // Remove the row with the given ID
    };

    return (
        <div className="space-y-4">
            {/* Table */}
            <div className="border rounded-md mt-4">
                <table className="min-w-full table-auto">
                    <thead className="bg-green-500">
                        <tr>
                            {columns.map((col, index) => (
                                <th key={index} className="px-4 py-2 text-left">
                                    {col}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {/* Existing Rows */}
                        {rows.map((row) => (
                            <tr key={row.id} className="border-t">
                                <td className="px-4 py-2">{row.col1 || '-'}</td>
                                <td className="px-4 py-2">{row.col2 || '-'}</td>
                                <td className="px-4 py-2 flex gap-2">
                                    <Button variant="destructive" size="sm" onClick={() => deleteRow(row.id)}>
                                        <IconX />
                                    </Button>
                                </td>
                            </tr>
                        ))}

                        {/* New Row (if being added) */}
                        {newRow && (
                            <tr className="border-t bg-gray-50">
                                <td className="px-4 py-2">
                                    <Input
                                        placeholder={columns[0]}
                                        value={newRow.col1 || ''}
                                        onChange={(e) => handleInputChange(e, 'col1')}
                                    />
                                </td>
                                <td className="px-4 py-2">
                                    <Input
                                        placeholder={columns[1]}
                                        value={newRow.col2 || ''}
                                        onChange={(e) => handleInputChange(e, 'col2')}
                                    />
                                </td>
                                <td className="px-4 py-2 flex gap-2">
                                    <Button variant="orange" onClick={saveNewRow}>
                                        Save
                                    </Button>
                                    <Button variant="secondary" onClick={cancelNewRow}>
                                        Close
                                    </Button>
                                </td>
                            </tr>
                        )}

                        {/* Placeholder Row if No Data */}
                        {rows.length === 0 && !newRow && (
                            <tr>
                                <td colSpan={columns.length} className="px-4 py-2 text-center">
                                    No Data Added
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
            {/* Add Row Button Outside Table */}
            {!newRow && (
                <Button variant="blue" onClick={() => setNewRow({ col1: '', col2: '' })}>
                    Add Row
                </Button>
            )}
        </div>
    );
};

export default DynamicTable;
