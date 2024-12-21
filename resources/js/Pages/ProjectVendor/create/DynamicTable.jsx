import { formatRupiah, formatWithoutRupiah } from '@/lib/utils';
import { useEffect, useState } from 'react';

import { Input } from '@/components/ui/input';

const DynamicTable = ({ setData, data, units, errors, handleCloseDialog }) => {
    const [columns] = useState(['#', 'ID', 'Group', 'Project Desc', 'Realisasi', 'Unit', 'Unit Price (Rp)', 'Invoice']);
    // const [rows, setRows] = useState(selectedRows);
    const [total, setTotal] = useState(0);

    useEffect(() => {
        if (handleCloseDialog) {
            const originalCloseDialog = handleCloseDialog;
            handleCloseDialog = () => {
                setTotal(0);
                originalCloseDialog();
            };
        }

        if (data.worksheet_projects.length > 0) {
            const newTotal = data.worksheet_projects.reduce((acc, project) => {
                const invoiceValue = parseFloat(project.Invoice);
                if (!isNaN(invoiceValue)) {
                    return acc + invoiceValue;
                }
                return acc;
            }, 0);

            setTotal(Number(newTotal).toFixed(0));
        }
    }, [handleCloseDialog, data.worksheet_projects]);

    const handleInputChange = (e, field, rowIndex) => {
        setTotal(0);
        let value = e.target.value;

        const updatedProjects = [...data.worksheet_projects];

        let realisasi = 0;

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
            realisasi = updatedProjects[rowIndex].Realisation || 0;
        }

        const unitPrice = parseFloat(updatedProjects[rowIndex].UnitPriceRP.toString().replace(/[^\d.]/g, '')) || 0;

        const invoice =
            !isNaN(parseFloat(realisasi)) && isFinite(realisasi) ? (parseFloat(realisasi) * unitPrice).toFixed(2) : '0';

        updatedProjects[rowIndex] = {
            ...updatedProjects[rowIndex],
            [field]: field === 'Realisation' ? realisasi : value,
            ...(field === 'Realisation' && { Invoice: invoice }),
        };

        const newTotal = updatedProjects.reduce((acc, project) => {
            const invoiceValue = parseFloat(project.Invoice);
            if (!isNaN(invoiceValue)) {
                return acc + invoiceValue;
            }
            return acc;
        }, 0);

        setTotal(Number(newTotal).toFixed(0));

        setData((prevData) => ({
            ...prevData,
            worksheet_projects: updatedProjects,
        }));
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
                    {data.worksheet_projects
                        .sort((a, b) => a.id - b.id)
                        .map((row, index) => (
                            <tr key={index}>
                                <td className="border p-2 text-[12px] text-center">{index + 1}</td>
                                <td className="border p-2 text-[12px] text-center">{row.id}</td>
                                <td className="border p-2 text-[12px]">{row.JobGroup}</td>
                                <td className="border p-2 text-[12px]">{row.JobDescription}</td>
                                <td className="border p-2 text-[12px] w-10">
                                    <Input
                                        type="text"
                                        className="h-9 text-sm w-[100px]"
                                        value={row.Realisation}
                                        onChange={(e) => handleInputChange(e, 'Realisation', index)}
                                        // placeholder="Realisation"
                                    />
                                </td>
                                <td className="border p-2 text-[12px] w-[120px]">{row.Unit}</td>
                                <td className="border p-2 text-[12px] w-[120px]">
                                    {formatWithoutRupiah(row.UnitPriceRP)}
                                </td>
                                <td className="border p-2 text-[12px] w-[120px]">{formatRupiah(row.Invoice || 0)}</td>
                            </tr>
                        ))}
                    <tr>
                        <td className="border p-2 text-[12px] text-right font-bold" colSpan="7">
                            Total
                        </td>
                        <td className="border p-2 text-[12px]">{formatRupiah(total.toLocaleString())}</td>
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
