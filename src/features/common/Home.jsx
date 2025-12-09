import React from 'react';
import { Menubar } from 'primereact/menubar';
import { InputText } from 'primereact/inputtext';
import { Badge } from 'primereact/badge';
import { Avatar } from 'primereact/avatar';  
import { Link, Outlet } from 'react-router-dom';

const Home = () => {
    const items = [
        {
            label: 'בית',
            icon: 'pi pi-home',
            command: () => { window.location.href = '/user/home'; }
        },
        {
            label: 'קורסים',
            icon: 'pi pi-list',
            command: () => { window.location.href = '/user/lesson'; }
        },
        {
            label: 'איזור אישי',
            icon: 'pi pi-user',
            command: () => { window.location.href = '/user/myAccount'; }
        },
        {
            label: 'עזרה',
            icon: 'pi pi-info-circle',
            items: [
                {
                    label: 'שאלות נפוצות',
                    icon: 'pi pi-question',
                    command: () => { window.location.href = '/help/faq'; }
                },
                {
                    label: 'צור קשר',
                    icon: 'pi pi-envelope',
                    command: () => { window.location.href = '/help/contact'; }
                }
            ]
        }
    ];

    const start = <img alt="logo" src="https://primefaces.org/cdn/primereact/images/logo.png" height="40" className="mr-2" />;
    const end = (
        <div className="flex align-items-center gap-2">
            <InputText placeholder="חיפוש" type="text" className="w-8rem sm:w-auto" />
            <Avatar image="https://primefaces.org/cdn/primevue/images/avatar/amyelsner.png" shape="circle" />
        </div>
    );

    return (
        <div>
            <Menubar model={items} start={start} end={end} />
            <Outlet />
        </div>
    );
};

export default Home;