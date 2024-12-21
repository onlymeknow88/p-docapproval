import {
    AlertDialog,
    AlertDialogContent,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/Components/ui/alert-dialog';

import { Button } from '@/Components/ui/button';
import { Checkbox } from '@/Components/ui/checkbox';
import { formatWithoutRupiah } from '@/lib/utils';
import { useState } from 'react';

function TermSheetModal({ isModalOpen, closeModal, termSheet, setSelectedRows, setData }) {
    const [columns] = useState(['#', 'ID', 'Group', 'Project Desc', 'Unit', 'Unit Price (Rp)']);
    const [localSelectedRows, setLocalSelectedRows] = useState([]);

    const handleCheckboxChange = (rowIndex) => {
        if (localSelectedRows.includes(rowIndex)) {
            setLocalSelectedRows(localSelectedRows.filter((index) => index !== rowIndex));
        } else {
            setLocalSelectedRows([...localSelectedRows, rowIndex]);
        }
    };

    const isRowSelected = (rowIndex) => localSelectedRows.includes(rowIndex);

    const transferSelectedRows = () => {
        const selectedData = localSelectedRows.map((index) => termSheet[index]);
        setSelectedRows(selectedData);
        setData('worksheet_projects', selectedData);
        closeModal();
    };

    return (
        <AlertDialog open={isModalOpen} onOpenChange={closeModal}>
            <AlertDialogContent className="max-w-6xl">
                <AlertDialogHeader>
                    <AlertDialogTitle>List TermSheet</AlertDialogTitle>
                </AlertDialogHeader>
                <div>
                    <table className="w-full border-collapse">
                        <thead>
                            <tr className="bg-green-500">
                                <th className="border p-2 text-left text-sm font-semibold">Select</th>
                                {columns.map((column, index) => (
                                    <th key={index} className="border p-2 text-left text-sm font-semibold">
                                        {column}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {termSheet.map((row, index) => (
                                <tr key={index}>
                                    <td className="border p-2 text-center">
                                        <Checkbox
                                            className="border-blue-500 border data-[state=checked]:bg-blue-500"
                                            checked={isRowSelected(index)}
                                            onCheckedChange={() => handleCheckboxChange(index)}
                                        />
                                        {/* <input
                                            type="checkbox"
                                            checked={isRowSelected(index)}
                                            onChange={() => handleCheckboxChange(index)}
                                        /> */}
                                    </td>
                                    <td className="border p-2 text-[13px]">{index + 1}</td>
                                    <td className="border p-2 text-[13px]">{row.id}</td>
                                    <td className="border p-2 text-[13px]">{row.JobGroup}</td>
                                    <td className="border p-2 text-[13px]">{row.JobDescription}</td>
                                    <td className="border p-2 text-[13px]">{row.Unit}</td>
                                    <td className="border p-2 text-[13px]">{formatWithoutRupiah(row.UnitPriceRP)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <AlertDialogFooter>
                    <Button variant="orange" onClick={transferSelectedRows}>
                        Add TermSheet
                    </Button>
                    <Button variant="ghost" onClick={closeModal}>
                        Close
                    </Button>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}

export default TermSheetModal;
