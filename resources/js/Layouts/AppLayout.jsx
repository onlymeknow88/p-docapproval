import * as VisuallyHidden from '@radix-ui/react-visually-hidden';

import { Avatar, AvatarFallback, AvatarImage } from '@/Components/ui/avatar';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from '@/Components/ui/dropdown-menu';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/Components/ui/sheet';
import { Head, Link, usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';

import ApplicationLogo from '@/Components/ApplicationLogo';
import { Button } from '@/components/ui/button';
import { Toaster } from '@/Components/ui/sonner';
import { ProtectedRoute } from '@/Pages/ProtectedRoute';
import { IconLayoutSidebar } from '@tabler/icons-react';
import axios from 'axios';
import Sidebar from './Partials/Sidebar';
import SidebarResponsive from './Partials/SidebarResponsive';

export default function AppLayout({ title, children }) {
    // const auth = usePage().props.auth.user;

    const [authUser, setAuthUser] = useState([]);

    const getInitialName = (fullName) => {
        if (!fullName) return '';

        const nameParts = fullName.trim().split(' ');

        const initials = nameParts.map((name) => name[0].toUpperCase()).join('');

        return initials;
    };

    const fetchUser = async () => {
        try {
            const response = await axios.get('/api/user', {
                headers: {
                    Authorization: `Bearer ${sessionStorage.getItem('token')}`,
                },
            });
            setAuthUser(response.data);
        } catch (error) {
            console.error('Error fetching user:', error);
        }
    };

    // useAuth();

    const logout = async () => {
        try {
            const response = await axios.post(
                '/api/logout',
                {}, // Pass an empty object for the body (if no other data is needed)
                {
                    headers: {
                        Accept: 'application/json',
                        Authorization: `Bearer ${sessionStorage.getItem('token')}`,
                    },
                },
            );
            console.log(response);
            if (response.status === 200) {
                sessionStorage.removeItem('token');
                window.location.href = route('login');
            }
        } catch (error) {
            console.error('Error during logout:', error);
        }
    };

    useEffect(() => {
        fetchUser();
    }, []);

    const { url } = usePage();

    return (
        <ProtectedRoute>
            <Head title={title} />
            <Toaster position="top-center" richColors />
            <div className="flex flex-row w-full min-h-screen">
                <div className="hidden w-1/5 border-r lg:block">
                    <div className="flex flex-col h-full min-h-screen gap-2">
                        <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
                            <ApplicationLogo />
                        </div>
                        <div className="flex-1">
                            {/* sidebar */}
                            <Sidebar url={url} auth={authUser} />
                        </div>
                    </div>
                </div>
                <div className="flex flex-col w-full lg:w-4/5">
                    <header className="flex h-12 items-center justify-between gap-4 border-b px-4 lg:h-[60px] lg:justify-end lg:px-6">
                        {/* sidebar responsive */}
                        <Sheet>
                            <SheetTrigger asChild>
                                <Button variant="outline" size="icon" className="shrink-0 md:hidden">
                                    <IconLayoutSidebar className="size-5" />
                                </Button>
                            </SheetTrigger>
                            <SheetContent side="left" className="flex flex-col max-h-screen overflow-y-auto">
                                <SheetHeader>
                                    <SheetTitle>
                                        <VisuallyHidden.Root>Sidebar Responsive</VisuallyHidden.Root>
                                    </SheetTitle>
                                    <SheetDescription>
                                        <VisuallyHidden.Root>Sidebar Responsive</VisuallyHidden.Root>
                                    </SheetDescription>
                                </SheetHeader>
                                {/* Menu Sidebar responsive */}
                                <SidebarResponsive url={url} auth={authUser} />
                            </SheetContent>
                        </Sheet>
                        {/* dropdown */}
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="flex gap-x-2">
                                    <span>Hi, {authUser.name}</span>

                                    <Avatar>
                                        <AvatarImage src={authUser.avatar} />
                                        <AvatarFallback>{getInitialName(authUser.name)}</AvatarFallback>
                                    </Avatar>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-56" align="end" forceMount>
                                <DropdownMenuLabel>Account</DropdownMenuLabel>
                                <DropdownMenuItem>Profile</DropdownMenuItem>
                                <DropdownMenuItem>Settings</DropdownMenuItem>
                                <DropdownMenuItem asChild>
                                    <Link onClick={logout} as="button" className="w-full">
                                        Logout
                                    </Link>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </header>
                    <main className="w-full">
                        <div className="relative">
                            <div
                                className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80"
                                aria-hidden="true"
                            >
                                <div
                                    className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-orange-100 to-orange-200 opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
                                    style={{
                                        clipPath:
                                            'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
                                    }}
                                />
                            </div>
                        </div>
                        <div className="gap-4 p-4 lg:gap-6">{children}</div>
                    </main>
                </div>
            </div>
        </ProtectedRoute>
    );
}
