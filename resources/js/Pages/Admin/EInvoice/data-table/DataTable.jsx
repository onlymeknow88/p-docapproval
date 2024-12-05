import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/Components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { flexRender, getCoreRowModel, getPaginationRowModel, useReactTable } from '@tanstack/react-table';
import { useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';
import { IconArrowsUpDown } from '@tabler/icons-react';
import axios from 'axios';

export function DataTable() {
    const [currentPage, setCurrentPage] = useState(1);
    const [perPage, setPerPage] = useState(10);
    const [globalFilter, setGlobalFilter] = useState('');
    const [sorting, setSorting] = useState({ id: '', desc: false });
    const [data, setData] = useState([]);
    const [totalPages, setTotalPages] = useState(1);
    const [prevPage, setPrevPage] = useState(null);
    const [nextPage, setNextPage] = useState(null);

    const columns = [
        {
            accessorKey: '#',
            header: '#', // Plain string
            cell: ({ row }) => row.index + 1 + (currentPage - 1) * perPage,
        },
        {
            accessorKey: 'UserName',
            header: 'UserName',
        },
        {
            accessorKey: 'VendorNo',
            header: 'VendorNo', // Plain string
        },
        {
            accessorKey: 'VendorName',
            header: 'VendorName', // Plain string
        },
        {
            accessorKey: 'Abbreviation',
            header: 'Abbreviation', // Plain string
        },
        {
            accessorKey: 'Email',
            header: 'Email', // Plain string
        },
        {
            accessorKey: 'VendorType',
            header: 'VendorType', // Plain string
        },
        {
            accessorKey: 'NoTelp',
            header: 'NoTelp', // Plain string
        },
        {
            accessorKey: 'Active',
            header: 'Active', // Plain string
            cell: ({ row }) => (row.original.Active == 1 ? 'Aktif' : 'Tidak Aktif'),
        },
    ];

    const fetchVendors = async () => {
        try {
            const response = await axios.get('/api/admin/vendor', {
                params: {
                    page: currentPage,
                    load: perPage,
                    search: globalFilter || '',
                    sortColumn: sorting?.id || '',
                    sortDirection: sorting?.desc ? 'desc' : 'asc',
                },
                headers: { Authorization: `Bearer ${sessionStorage.getItem('token')}` },
            });

            const {
                result,
                result: { last_page, current_page, prev_page_url, next_page_url },
            } = response.data;

            setData(result.data);
            setTotalPages(last_page);
            setCurrentPage(current_page);
            setPrevPage(prev_page_url);
            setNextPage(next_page_url);
        } catch (error) {
            console.error('Failed to fetch vendors:', error);
        }
    };

    const table = useReactTable({
        data,
        columns,
        state: {
            globalFilter,
            pagination: { pageIndex: currentPage - 1, pageSize: perPage },
            sorting: sorting ? [sorting] : [],
        },
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        manualPagination: true, // Backend handles pagination
        manualSorting: true, // Backend handles sorting
        pageCount: totalPages, // Total pages from the API
        onGlobalFilterChange: setGlobalFilter,
    });

    useEffect(() => {
        fetchVendors();
    }, []);



    return (
        <>
            <div className='py-4'>
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => (
                                    <TableHead key={header.id}>
                                        {header.isPlaceholder ? null : (
                                            <div className="flex items-center justify-between">
                                                {/* Render the header name */}
                                                <span>
                                                    {typeof header.column.columnDef.header === 'function'
                                                        ? header.column.columnDef.header()
                                                        : header.column.columnDef.header}
                                                </span>

                                                {/* Manual Sorting Button */}
                                                {!['VendorType', 'Abbreviation'].includes(header.column.id) && (
                                                    <Button
                                                        variant="ghost"
                                                        onClick={() => handleManualSort(header.column.id)}
                                                        className="ml-2"
                                                    >
                                                        <IconArrowsUpDown
                                                            className="h-4 w-4"
                                                            style={{
                                                                transform:
                                                                    sorting?.id === header.column.id && sorting?.desc
                                                                        ? 'rotate(180deg)'
                                                                        : 'none',
                                                            }}
                                                        />
                                                    </Button>
                                                )}
                                            </div>
                                        )}
                                    </TableHead>
                                ))}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow key={row.id} data-state={row.getIsSelected() && 'selected'}>
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id}>
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={columns.length} className="h-24 text-center">
                                    No results.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
            <div className='flex items-center justify-between mt-6 mb-10'>
                <div className='flex-1 text-sm'>
                    Total {totalPages} rows
                </div>
                <div className='flex items-center space-x-6 lg:space-x-8'>
                    <div className='flex items-center space-x-2'>
                        <p className='text-sm font-medium'>Rows per page</p>
                        <Select value={perPage}>
                            <SelectTrigger className="h-8 w-[70px]">
                                <SelectValue placeholder="load" />
                            </SelectTrigger>
                            <SelectContent>
                                {[10, 25, 50, 100].map((load) => (
                                    <SelectItem key={load} value={load}>
                                        {load}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                </div>
            </div>
        </>
    );
}
