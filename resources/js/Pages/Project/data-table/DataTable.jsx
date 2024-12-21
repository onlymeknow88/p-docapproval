import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/Components/ui/alert-dialog';
import { IconArrowsUpDown, IconChevronLeft, IconChevronRight, IconRefresh, IconTrash } from '@tabler/icons-react';
import { Pagination, PaginationContent } from '@/Components/ui/pagination';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/Components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { flexRender, getCoreRowModel, getPaginationRowModel, useReactTable } from '@tanstack/react-table';
import { useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';
import Edit from '../edit/edit';
import { Input } from '@/Components/ui/input';
import axios from 'axios';
import callAPI from '@/config/callAPI';
import { toast } from 'sonner';

export function DataTable({ setRefreshFunction, vendors, project_types, units }) {
    const [currentPage, setCurrentPage] = useState(0);
    const [perPage, setPerPage] = useState(10);
    const [globalFilter, setGlobalFilter] = useState('');
    const [sorting, setSorting] = useState({ id: '', desc: false });
    const [data, setData] = useState([]);
    const [totalPages, setTotalPages] = useState('');
    const [lastPage, setLastPage] = useState();
    const [prevPage, setPrevPage] = useState(null);
    const [nextPage, setNextPage] = useState(null);

    const [isLoading, setIsLoading] = useState(false);
    const [isLoadingPage, setIsLoadingPage] = useState(false);

    const columns = [
        {
            accessorKey: '#',
            header: '#', // Plain string
            cell: ({ row }) => row.index + 1 + (currentPage - 1) * perPage,
        },
        {
            accessorKey: 'PONum',
            header: 'PO Number',
        },
        {
            accessorKey: 'ProjectName',
            header: 'Project Name', // Plain string
        },
        {
            accessorKey: 'Abbreviation',
            header: 'Abbreviation', // Plain string
        },
        {
            accessorKey: 'ProjectValue',
            header: 'Project Value', // Plain string
        },
        {
            accessorKey: 'VendorId',
            header: 'Vendor ID', // Plain string
        },
        {
            accessorKey: 'ProjectType',
            header: 'Project Type', // Plain string
        },
        {
            accessorKey: 'aksi',
            header: 'Aksi', // Plain string,
            cell: ({ row }) => (
                <div className="flex items-center gap-x-1">
                    <Edit
                        id={row.original.id}
                        row={row.original}
                        refreshData={fetchVendors}
                        vendors={vendors}
                        project_types={project_types}
                        units={units}
                    />
                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button variant="red" size="sm">
                                <IconTrash size="size-4" />
                            </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Apakah anda bener-bener yakin?</AlertDialogTitle>
                                <AlertDialogDescription>
                                    Tindakan ini tidak dapat dibatalkan. Tindakan ini akan menghapus data secara
                                    permanen dan menghapus data anda dari server kami
                                </AlertDialogDescription>
                                <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction onClick={() => handleDelete(row.original.id)}>
                                        Delete
                                    </AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogHeader>
                        </AlertDialogContent>
                    </AlertDialog>
                </div>
            ),
        },
    ];

    function deleteData(id) {
        const url = '/api/ami/project/' + id + '/destroy';

        return callAPI({
            url,
            method: 'DELETE',
            token: true,
        });
    }

    const handleDelete = async (id) => {
        try {
            setIsLoading(true);
            const res = await deleteData(id);
            if (res.data.meta.code === 200) {
                setTimeout(() => {
                    toast.success('Data berhasil dihapus');
                    fetchVendors();
                    setIsLoading(false);
                }, 1000);
            }
        } catch (error) {
            toast.error('Data gagal dihapus');
        }
    };

    const fetchVendors = async () => {
        try {
            setIsLoadingPage(true);
            const response = await axios.get('/api/ami/project', {
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
            setIsLoadingPage(false);
            console.error('Failed to fetch vendors:', error);
        } finally {
            setIsLoadingPage(false);
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
        setRefreshFunction(() => fetchVendors);
    }, [perPage, currentPage, globalFilter, sorting, setRefreshFunction, isLoadingPage, isLoading]);

    const handlePerPage = (e) => {
        // console.log(e)
        setPerPage(e);
        setCurrentPage(1);
    };

    const handleNext = () => {
        if (currentPage < lastPage) {
            setIsLoadingPage(true);
            setTimeout(() => {
                setCurrentPage((prev) => prev + 1);
                setIsLoadingPage(false);
            }, 500);
        }
    };

    const handlePrevious = () => {
        if (currentPage > 1) {
            setIsLoadingPage(true);
            setTimeout(() => {
                setCurrentPage((prev) => prev - 1);
                setIsLoadingPage(false);
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
                                                {!['aksi', '#', 'Abbreviation', 'VendorId', 'ProjectType'].includes(
                                                    header.column.id,
                                                ) && (
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
            <AlertDialog open={isLoading} onOpenChange={setIsLoading}>
                <AlertDialogContent className="max-w-[200px] border-none ">
                    <div style={styles.loadingContainer}>
                        <div style={styles.spinner}></div>
                        <p>Loading...</p>
                    </div>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}

const styles = {
    loadingContainer: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
    },
    spinner: {
        width: '40px',
        height: '40px',
        border: '4px solid #f3f3f3',
        borderTop: '4px solid #3498db',
        borderRadius: '50%',
        animation: 'spin 1s linear infinite',
    },
};

// Add the spinning animation in your CSS file or as a style tag
const spinnerStyles = `
@keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
}
`;

// Add this to your HTML or include it in a CSS file dynamically
if (typeof document !== 'undefined') {
    const styleSheet = document.createElement('style');
    styleSheet.type = 'text/css';
    styleSheet.innerText = spinnerStyles;
    document.head.appendChild(styleSheet);
}
