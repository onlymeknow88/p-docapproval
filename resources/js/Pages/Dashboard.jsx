import AppLayout from '@/Layouts/AppLayout';
export default function Dashboard() {
    return <div>ini dahboard</div>;
}

Dashboard.layout = (page) => <AppLayout children={page} title="Dashboard" />;
