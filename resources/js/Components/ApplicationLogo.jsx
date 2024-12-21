import { cn } from '@/lib/utils';
import { Link } from '@inertiajs/react';

export default function ApplicationLogo({ url = '#', size = 'size-9', isTitle = true }) {
    return (
        <Link href={url} className="flex items-center gap-2">
            <img src="/images/justadaro.png" alt="logo" className={cn(size)} />
            {isTitle && (
                <div className="flex flex-col">
                    <span className="font-bold loading-none text-foreground">Dokumen Approval</span>
                    <span className="text-xs font-medium text-mute">Adaro Minerals Indonesia</span>
                </div>
            )}
        </Link>
    );
}
