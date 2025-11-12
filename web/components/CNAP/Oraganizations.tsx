"use client";
import { useCallback, useEffect, useState } from "react";
import { ColumnDefinition } from "../../types/api";
import { ReusableTable } from "../Base/ReusableTable";

interface Organisation {
    id: string;
    name: string;
    type: string;
    address: string;
    phone_number: number;
    email: string;
}

const columns: ColumnDefinition<Organisation>[] = [
    {
        accessor: 'name',
        header: 'Назва:'
    },
    {
        accessor: 'type',
        header: 'Тип:'
    },
    {
        accessor: 'address',
        header: 'Адреса:'
    },
    {
        accessor: 'phone_number',
        header: 'Телефон:',
        cell: (org) => org.phone_number.toString()
    },
    {
        accessor: 'email',
        header: 'Email:'
    },
    {
        accessor: 'id',
        header: '',
        cell: (org, onAction) => (
            <button
                onClick={() => onAction?.(org, 'edit')}
                className="w-full shrink-0 rounded-[10em] bg-white px-5 py-3 text-sm font-semibold ring transition-colors hover:bg-gray-100 sm:w-auto cursor-pointer">
                Редагувати
            </button>
        )
    },
    {
        accessor: 'id',
        header: '',
        cell: (org, onAction) => (
            <button
                onClick={() => onAction?.(org, 'delete')}
                className="rounded-[10em] bg-black px-4 py-3 text-xs font-semibold text-white transition-colors hover:bg-gray-800 cursor-pointer">
                Видалити
            </button>
        )
    }
];

export function Organisations() {
    const [searchTerm, setSearchTerm] = useState('');
    const fetchOrganisations = useCallback(async (page: number, size: number, query: string) => {
        // TODO: Replace with actual API call
        const filtered = sampleOrganisations.filter(org =>
            Object.values(org).some(value =>
                value.toString().toLowerCase().includes(query.toLowerCase())
            )
        );

        const total_items = filtered.length;
        const total_pages = Math.ceil(total_items / size);
        return {
            items: filtered.slice((page - 1) * size, page * size),
            total_items,
            total_pages,
            page,
            size
        };
    }, []);
    const handleAction = async (org: Organisation, action: 'edit' | 'delete') => {
        if (action === 'edit') {
            // TODO: Implement edit logic
            alert(`Editing organization: ${org.name}`);
        } else if (action === 'delete') {
            if (window.confirm(`Are you sure you want to delete ${org.name}?`)) {
                // TODO: Implement delete logic
                alert(`Deleting organization: ${org.name}`);
            }
        }
    };

    return (
        <ReusableTable
            columns={columns}
            fetchFunction={fetchOrganisations}
            onAction={handleAction}
            title="Список організацій"
            addNewLink="/organisations/new"
            addNewText="Зареєструвати організацію"
            searchPlaceholder="Пошук організацій..."
        />
    );
}


const sampleOrganisations: Organisation[] = [
    {
        id: "1",
        name: "ДоброVet",
        type: "Ветеринарна клініка",
        address: "вул. Шевченка, 12",
        phone_number: 380501234567,
        email: "selychenko.hal@gmail.com"
    },
    {
        id: "1",
        name: "ДоброVet",
        type: "Ветеринарна клініка",
        address: "вул. Шевченка, 12",
        phone_number: 380501234567,
        email: "selychenko.hal@gmail.com"
    },
    {
        id: "1",
        name: "ДоброVet",
        type: "Ветеринарна клініка",
        address: "вул. Шевченка, 12",
        phone_number: 380501234567,
        email: "selychenko.hal@gmail.com"
    },
    {
        id: "1",
        name: "ДоброVet",
        type: "Ветеринарна клініка",
        address: "вул. Шевченка, 12",
        phone_number: 380501234567,
        email: "selychenko.hal@gmail.com"
    },
    {
        id: "1",
        name: "ДоброVet",
        type: "Ветеринарна клініка",
        address: "вул. Шевченка, 12",
        phone_number: 380501234567,
        email: "selychenko.hal@gmail.com"
    },
    // ...other sample data
];