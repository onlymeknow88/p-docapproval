import { Card, CardContent } from '@/Components/ui/card';

import HeaderTitle from '@/Components/HeaderTitle';
import AppLayout from '@/Layouts/AppLayout';
import { IconUsersGroup } from '@tabler/icons-react';
import { useState } from 'react';
import { Create } from './create/create';
import { DataTable } from './data-table/DataTable';

export default function Index(props) {
    const { data: projects } = props.projects;
    const ba_types = props.ba_types;
    const companies = props.companies;

    const project_type = projects.map((project) => project.ProjectType);

    const user = atob(sessionStorage.getItem('user'));

    const filteredProjects = projects.filter((project) => project.VendorId === user);

    const convertedDataProject = filteredProjects.map((item) => ({
        value: item.PONum,
        label: item.PONum,
    }));

    const convertedDataBAType = ba_types.map((item) => ({
        value: item.Value,
        label: item.Text,
    }));

    const convertedDataCompany = companies.map((item) => ({
        value: item.Value,
        label: item.Text,
    }));

    const [refreshFunction, setRefreshFunction] = useState(null);
    return (
        <div className="flex flex-col w-full pb-32">
            <div className="flex flex-col items-start justify-between mb-8 gap-y-4 lg:flex-row lg:items-center">
                <HeaderTitle
                    title={props.page_settings.title}
                    subtitle={props.page_settings.subtitle}
                    icon={IconUsersGroup}
                />
                <Create
                    projects={convertedDataProject}
                    ba_types={convertedDataBAType}
                    companies={convertedDataCompany}
                    refreshFunction={refreshFunction}
                    project_type={project_type}
                    // data={data}
                    // setData={setData}
                    // handleSubmit={handleSubmit}
                    // errors={errors}
                />
            </div>
            <Card>
                <CardContent className="py-4">
                    <DataTable setRefreshFunction={setRefreshFunction} />
                </CardContent>
            </Card>
        </div>
    );
}

Index.layout = (page) => <AppLayout children={page} title="Project Vendor" />;
