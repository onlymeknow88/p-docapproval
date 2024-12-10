import { Pagination, PaginationContent } from '@/Components/ui/pagination';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/Components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { IconArrowsUpDown, IconChevronLeft, IconChevronRight, IconRefresh } from '@tabler/icons-react';
import { flexRender, getCoreRowModel, getPaginationRowModel, useReactTable } from '@tanstack/react-table';
import { useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/Components/ui/input';
import axios from 'axios';

export function DataTable() {
    const [currentPage, setCurrentPage] = useState(0);
    const [perPage, setPerPage] = useState(10);
    const [globalFilter, setGlobalFilter] = useState('');
    const [sorting, setSorting] = useState({ id: '', desc: false });
    const [data, setData] = useState([]);
    const [totalPages, setTotalPages] = useState(1);
    const [lastPage, setLastPage] = useState();
    const [prevPage, setPrevPage] = useState(null);
    const [nextPage, setNextPage] = useState(null);

    const [isLoading, setIsLoading] = useState(false);

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
            setIsLoading(true);
            const response = await axios.get('/api/admin/vendor', {
                params: {
                    page: currentPage,
                    load: perPage,
                    search: globalFilter || '',
                    filter: sorting?.id || '',
                    direction: sorting?.desc ? 'desc' : 'asc',
                },
                headers: { Authorization: `Bearer ${sessionStorage.getItem('token')}` },
            });

            const {
                result,
                result: { total, last_page, current_page, prev_page_url, next_page_url, per_page },
            } = response.data;

            setData(result.data);
            setPerPage(per_page);
            setTotalPages(total);
            setCurrentPage(current_page);
            setPrevPage(prev_page_url);
            setNextPage(next_page_url);
            setLastPage(last_page);
        } catch (error) {
            setIsLoading(false);
            console.error('Failed to fetch vendors:', error);
        } finally {
            setIsLoading(false);
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
    }, [perPage, currentPage, globalFilter, sorting]);

    const handlePerPage = (e) => {
        // console.log(e)
        setPerPage(e);
        setCurrentPage(1);
    };

    const handleNext = () => {
        if (currentPage < lastPage) {
            setIsLoading(true);
            setTimeout(() => {
                setCurrentPage((prev) => prev + 1);
                setIsLoading(false);
            }, 500);
        }
    };

    const handlePrevious = () => {
        if (currentPage > 1) {
            setIsLoading(true);
            setTimeout(() => {
                setCurrentPage((prev) => prev - 1);
                setIsLoading(false);
            }, 500);
        }
    };

    const handleSearch = (e) => {
        setGlobalFilter(e.target.value);
        setCurrentPage(1);
    };

    const handleManualSort = (columnId) => {
        setSorting((prevSorting) => {
            if (prevSorting?.id === columnId) {
                return {
                    id: columnId,
                    desc: !prevSorting.desc,
                };
            }
            return { id: columnId, desc: false };
        });
    };

    return (
        <>
            <div className="flex w-full flex-col gap-4 lg:flex-row lg:items-center">
                <Input
                    className="w-full sm:w-1/4"
                    placeholder="Search..."
                    value={globalFilter ?? ''}
                    onChange={handleSearch}
                />
                <Button variant="red" size="xl" onClick={() => setGlobalFilter('')}>
                    <IconRefresh className="size-4" />
                    Bersihkan
                </Button>
            </div>
            <div className="py-4">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => (
                                    <TableHead key={header.id} className="bg-green-500 text-white">
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
                                                        className="ml-2 hover:bg-green-500"
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
                            <>
                                {isLoading ? (
                                    <TableRow>
                                        <TableCell colSpan={columns.length} className="h-24 text-center">
                                            Loading...
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={columns.length} className="h-24 text-center">
                                            No results.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </>
                        )}
                    </TableBody>
                </Table>
            </div>
            <div className="flex flex-col lg:flex-row items-center justify-between mt-6  space-y-4 lg:space-y-0">
                <div className="flex-1 text-sm text-center lg:text-left">
                    Total <span className="text-orange-500">{totalPages}</span> rows
                </div>
                <div className="flex items-center space-y-4 lg:space-y-0 lg:space-x-6 flex-col lg:flex-row">
                    <div className="flex items-center space-x-2">
                        <p className="text-sm font-medium">Rows per page</p>
                        <Select value={perPage} onValueChange={handlePerPage}>
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
                    <div className="flex w-full lg:w-[100px] items-center justify-center text-sm font-medium">
                        Page {currentPage} of {lastPage}
                    </div>
                    <div className="flex items-center space-x-2">
                        <Pagination>
                            <PaginationContent>
                                <Button
                                    disabled={currentPage === 1 || isLoading}
                                    onClick={handlePrevious}
                                    variant="ghost"
                                    className="lg:h-8 lg:w-8 lg:p-0"
                                >
                                    <IconChevronLeft />
                                </Button>
                            </PaginationContent>
                        </Pagination>
                        <Pagination>
                            <PaginationContent>
                                <Button
                                    disabled={currentPage === lastPage || isLoading}
                                    onClick={handleNext}
                                    variant="ghost"
                                    className="lg:h-8 lg:w-8 lg:p-0"
                                >
                                    <IconChevronRight />
                                </Button>
                            </PaginationContent>
                        </Pagination>
                    </div>
                </div>
            </div>
        </>
    );
}
