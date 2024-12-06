
const ColumnHeader = () => {

}
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
