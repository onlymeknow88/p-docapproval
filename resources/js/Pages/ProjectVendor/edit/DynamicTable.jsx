import { Edit, Save, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';

import { Button } from '@/Components/ui/button';
import { Input } from '@/components/ui/input';
import { formatRupiah } from '@/lib/utils';

const DynamicTable = ({ setData, data, units, errors, handleCloseDialog, worksheetBa = [] }) => {
    const [columns] = useState([
        '#',
        'ID',
        'Group',
        'Project Desc',
        'Realisasi',
        'Unit',
        'Unit Price (Rp)',
        'Invoice',
        'Action',
    ]);
    const [total, setTotal] = useState(0);
    const [totalWSProject, setTotalWSProject] = useState(0);
    const [editingIndex, setEditingIndex] = useState(null); // Track which row is being edited

    useEffect(() => {
        if (handleCloseDialog) {
            const originalCloseDialog = handleCloseDialog;
            handleCloseDialog = () => {
                setTotal(0);
                originalCloseDialog();
            };
        }

        if (worksheetBa.length > 0) {
            const newTotal = worksheetBa.reduce((acc, project) => {
                const invoiceValue = parseFloat(project.worksheet_projects.Invoice);
                if (!isNaN(invoiceValue)) {
                    return acc + invoiceValue;
                }
                return acc;
            }, 0);

            setTotal(Number(newTotal).toFixed(0));
        }
    }, [handleCloseDialog, data.worksheet_projects]);

    const handleInputChange = (e, field, rowIndex) => {
        let value = e.target.value; // Get the raw input value

        // Copy the current worksheet_ba data
        const updatedProjects = [...data.worksheet_bas];

        let realisasi = 0; // Default to raw input value

        if (field === 'Realisation') {
            // Handle percentage or raw decimal input dynamically
            if (value.includes('%')) {
                // Remove '%' symbol and convert to decimal
                realisasi = parseFloat(value.replace('%', '')) / 100;
            } else {
                // Allow raw decimal input during typing
                if (value === '' || value === '0.' || /^[0-9]*\.?[0-9]*$/.test(value)) {
                    realisasi = value;
                } else {
                    realisasi = parseFloat(value) || 0; // Convert to number for valid input
                }
            }
        } else {
            realisasi = updatedProjects[rowIndex]?.worksheet_projects?.Realisation || 0;
        }

        const unitPrice = parseFloat(
            updatedProjects[rowIndex]?.worksheet_projects?.UnitPriceRP?.toString().replace(/[^\d.]/g, '') || '0',
        );

        // Calculate invoice based on realisation and unit price
        const invoice =
            !isNaN(parseFloat(realisasi)) && isFinite(realisasi) ? (parseFloat(realisasi) * unitPrice).toFixed(2) : '0';

        // Update the specific field and nested structure
        updatedProjects[rowIndex] = {
            ...updatedProjects[rowIndex],
            Invoice: invoice,
            Realisation: realisasi,
            worksheet_projects: {
                ...updatedProjects[rowIndex]?.worksheet_projects,
                [field]: field === 'Realisation' ? realisasi : value,
                ...(field === 'Realisation' && { Invoice: invoice }),
            },
        };

        // Recalculate the total invoice value immediately after the input change
        const newTotal = updatedProjects.reduce((acc, project) => {
            const invoiceValue = parseFloat(project?.worksheet_projects?.Invoice);
            if (!isNaN(invoiceValue)) {
                return acc + invoiceValue;
            }
            return acc;
        }, 0);

        // Update the total
        setTotal(Number(newTotal).toFixed(0));

        // Update the state
        setData((prevData) => ({
            ...prevData,
            worksheet_bas: updatedProjects,
        }));
    };

    const handleDelete = (rowIndex) => {
        const updatedProjects = data.worksheet_bas.filter((_, index) => index !== rowIndex);

        setData((prevData) => ({
            ...prevData,
            worksheet_bas: updatedProjects,
        }));

        // Recalculate the total invoice value
        const newTotal = updatedProjects.reduce((acc, project) => {
            const invoiceValue = parseFloat(project?.worksheet_projects?.Invoice);
            if (!isNaN(invoiceValue)) {
                return acc + invoiceValue;
            }
            return acc;
        }, 0);

        setTotal(Number(newTotal).toFixed(0));
    };

    const toggleEdit = (index) => {
        setEditingIndex(index === editingIndex ? null : index);
    };

    return (
        <div className="w-full overflow-x-auto">
            <table className="w-full border-collapse">
                <thead>
                    <tr className="bg-green-500">
                        {columns.map((column, index) => (
                            <th key={index} className="border p-2 text-left text-[13px] font-semibold">
                                {column}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {worksheetBa &&
                        worksheetBa.length > 0 &&
                        worksheetBa.map((row, index) => (
                            <tr key={index}>
                                <td className="border p-2 text-[12px] text-center">{index + 1}</td>
                                <td className="border p-2 text-[12px] text-center">{row.worksheet_project_id}</td>
                                <td className="border p-2 text-[12px]">{row.worksheet_projects.JobGroup}</td>
                                <td className="border p-2 text-[12px]">{row.worksheet_projects.JobDescription}</td>
                                <td className="border p-2 text-[12px]">
                                    {editingIndex === index ? (
                                        <Input
                                            type="text"
                                            className="h-9 text-sm w-[100px]"
                                            value={row.worksheet_projects.Realisation || ''}
                                            onChange={(e) => handleInputChange(e, 'Realisation', index)}
                                        />
                                    ) : (
                                        row.worksheet_projects.Realisation || ''
                                    )}
                                </td>

                                <td className="border p-2 text-[12px]">{row.worksheet_projects.Unit}</td>
                                <td className="border p-2 text-[12px]">
                                    {formatRupiah(row.worksheet_projects.UnitPriceRP)}
                                </td>
                                <td className="border p-2 text-[12px]">
                                    {formatRupiah(row.worksheet_projects.Invoice)}
                                </td>
                                <td className="border p-2 text-[12px] w-[80px]">
                                    <div className="flex space-x-2">
                                        <Button variant="outline" onClick={() => toggleEdit(index)}>
                                            {editingIndex === index ? (
                                                <Save className="h-4 w-4" />
                                            ) : (
                                                <Edit className="h-4 w-4" />
                                            )}
                                        </Button>
                                        <Button variant="outline" onClick={() => handleDelete(index)}>
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    <tr>
                        <td className="border p-2 text-[12px] text-right font-bold" colSpan="7">
                            Total
                        </td>
                        <td className="border p-2 text-[12px]" colSpan={2}>
                            {formatRupiah(total.toLocaleString())}
                        </td>
                    </tr>
                </tbody>
            </table>
            <div className="mt-2">
                <span className="text-[12px]">
                    Noted: Realisasi bisa menggunakan percentase atau angka. cth input realisasi{' '}
                    <span className="text-red-500">( 50% ) atau ( 0.5 )</span> dan{' '}
                    <span className="text-red-500">( 1 ) atau ( 1.00 )</span>
                </span>
            </div>
        </div>
    );
};

export default DynamicTable;
