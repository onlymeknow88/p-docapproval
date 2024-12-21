import { IconBook2, IconDashboard, IconUser, IconUserBolt, IconUsersGroup } from '@tabler/icons-react';

import ApplicationLogo from '@/Components/ApplicationLogo';
import NavLinkResponsive from '@/Components/NavLinkResponsive';

export default function SidebarResponsive({ url, auth }) {
    const encodedType = sessionStorage.getItem('type');

    const type = atob(encodedType);
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
                {type === 'ami' && (
                    <>
                        <div className="px-3 py-2 text-sm font-semibold text-foreground">Ami</div>
                        <NavLinkResponsive
                            url={route('ami.project.index')}
                            active={url.startsWith('/ami/project')}
                            title="Project"
                            icon={IconBook2}
                        />
                    </>
                )}
                {type === 'vendor' && (
                    <>
                        <div className="px-3 py-2 text-sm font-semibold text-foreground">Vendor</div>
                        <NavLinkResponsive
                            url={route('vendor.project-vendor.index')}
                            active={url.startsWith('/vendor/project-vendor')}
                            title="Project"
                            icon={IconBook2}
                        />
                    </>
                )}
                {/* <div className="px-3 py-2 text-sm font-semibold text-foreground">AMI</div>
                <NavLinkResponsive
                    url={route('vendor.project.index')}
                    active={url.startsWith('/vendor/project')}
                    title="Project"
                    icon={IconBook2}
                />
                <div className="px-3 py-2 text-sm font-semibold text-foreground">Vendor</div>
                <NavLinkResponsive
                    url={route('vendor.project-vendor.index')}
                    active={url.startsWith('/vendor/project-vendor')}
                    title="Project"
                    icon={IconBook2}
                /> */}
                <div className="px-3 py-2 text-sm font-semibold text-foreground">Master</div>
                <NavLinkResponsive
                    url={route('admin.user.index')}
                    active={url.startsWith('/admin/user')}
                    title="User"
                    icon={IconUser}
                />
                <NavLinkResponsive
                    url={route('admin.vendor.index')}
                    active={url.startsWith('/admin/vendor')}
                    title="Vendor"
                    icon={IconUserBolt}
                />
                <NavLinkResponsive
                    url={route('admin.orchart-approval.index')}
                    active={url.startsWith('/admin/orchart-approval')}
                    title="Orchart Approval"
                    icon={IconUsersGroup}
                />
            </nav>
        </nav>
    );
}
