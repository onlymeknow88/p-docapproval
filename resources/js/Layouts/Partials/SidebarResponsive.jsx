import { IconChartDots2, IconDashboard, IconMoneybag } from '@tabler/icons-react';

import ApplicationLogo from '@/Components/ApplicationLogo';
import NavLinkResponsive from '@/Components/NavLinkResponsive';

export default function SidebarResponsive({ url, auth }) {
    return (
        <nav className="grid gap-6 text-lg font-medium">
            <ApplicationLogo />
            <nav className="grid items-start text-sm font-semibold lg:px-4">
                <div className="px-3 py-2 text-sm font-semibold text-foreground">Dashboard</div>
                <NavLinkResponsive
                    url={route('dashboard')}
                    active={url.startsWith('/dashboard')}
                    title="Dashboard"
                    icon={IconDashboard}
                />
                <div className="px-3 py-2 text-sm font-semibold text-foreground">Master</div>
                {/* <NavLinkResponsive url={route('admin.categories.index')} active={url.startsWith('/admin/categories')} title="Kategori" icon={IconCategory} /> */}
            </nav>
        </nav>
    );
}