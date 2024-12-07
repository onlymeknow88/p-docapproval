import { IconDashboard, IconUser, IconUserBolt, IconUsersGroup } from '@tabler/icons-react';

import NavLink from '@/Components/NavLink';

export default function Sidebar({ url, auth }) {
    return (
        <nav className="grid items-start px-2 text-sm font-semibold lg:px-4">
            <div className="px-3 py-2 text-sm font-semibold text-foreground">Dashboard</div>
            <NavLink
                url={route('dashboard')}
                active={url.startsWith('/dashboard')}
                title="Dashboard"
                icon={IconDashboard}
            />
            <div className="px-3 py-2 text-sm font-semibold text-foreground">Master</div>
            <NavLink
                url={route('admin.user.index')}
                active={url.startsWith('/admin/user')}
                title="User"
                icon={IconUser}
            />
            <NavLink
                url={route('admin.vendor.index')}
                active={url.startsWith('/admin/vendor')}
                title="Vendor"
                icon={IconUserBolt}
            />
            <NavLink
                url={route('admin.orchart-approval.index')}
                active={url.startsWith('/admin/orchart-approval')}
                title="Orchart Approval"
                icon={IconUsersGroup}
            />
        </nav>
    );
}
