import {
    AlertDialog,
    AlertDialogContent,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/Components/ui/alert-dialog';
import { useEffect, useState } from 'react';

import { Button } from '@/Components/ui/button';
import { Checkbox } from '@/Components/ui/checkbox';
import { formatWithoutRupiah } from '@/lib/utils';

function TermSheetModal({ isModalOpen, closeModal, termSheet, setSelectedRows, setData, worksheetBa }) {
    const [columns] = useState(['#', 'ID', 'Group', 'Project Desc', 'Unit', 'Unit Price (Rp)']);
    const [localSelectedRows, setLocalSelectedRows] = useState([]);

    // Effect to pre-select rows that already exist in worksheetBa
    useEffect(() => {
        // Find indices of rows that match existing worksheetBa entries
        const preSelectedIndices = termSheet.reduce((selected, row, index) => {
            // Check if the current row exists in worksheetBa based on id and worksheet_project_id
            const isInWorksheetBa = worksheetBa.some(
                (baRow) => baRow.id === row.id && baRow.worksheet_project_id === row.worksheet_project_id,
            );

            return isInWorksheetBa ? [...selected, index] : selected;
        }, []);

        setLocalSelectedRows(preSelectedIndices);
    }, [termSheet, worksheetBa]);

    const handleCheckboxChange = (rowIndex) => {
        if (localSelectedRows.includes(rowIndex)) {
            setLocalSelectedRows(localSelectedRows.filter((index) => index !== rowIndex));
        } else {
            setLocalSelectedRows([...localSelectedRows, rowIndex]);
        }
    };

    const filteredTermSheet = termSheet.filter(
        (row) => !worksheetBa.some((baRow) => baRow.worksheet_project_id === row.id),
    );

    const isRowSelected = (rowIndex) => localSelectedRows.includes(rowIndex);

    const transferSelectedRows = () => {
        // Get the selected rows based on localSelectedRows
        const selectedData = localSelectedRows.map((index) => filteredTermSheet[index]);
        console.log(selectedData, 'termsheet selected');
        // Map the selected data to include worksheet_projects data (JobGroup and JobDescription)
        const updatedWorksheetBa = [
            ...worksheetBa, // Keep the existing data
            ...selectedData.map((row) => ({
                // id: row.id,

                // berita_acara_id: row.berita_acara_id, // Retain existing properties
                worksheet_project_id: row.id,
                Realisation: row.Realisation,
                Invoice: row.Invoice,
                worksheet_projects: {
                    // Add the nested object
                    JobGroup: row.JobGroup,
                    JobDescription: row.JobDescription,
                    Realisation: row.Realisation,
                    Unit: row.Unit,
                    UnitPriceRP: row.UnitPriceRP,
                    Invoice: row.Invoice,
                },
                created_at: row.created_at,
                updated_at: row.updated_at,
            })),
        ];

        // console.log(updatedWorksheetBa)

        // Set the updated worksheet_ba data
        setData('worksheet_bas', updatedWorksheetBa);

        // Close the modal
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
                            {filteredTermSheet.map((row, index) => (
                                <tr key={index}>
                                    <td className="border p-2 text-center">
                                        <Checkbox
                                            className="border-blue-500 border data-[state=checked]:bg-blue-500"
                                            checked={
                                                isRowSelected(index) ||
                                                worksheetBa.some((baRow) => baRow.worksheet_project_id === row.id)
                                            }
                                            onCheckedChange={() => handleCheckboxChange(index)}
                                        />
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
