import { Organizations } from '../../components/CNAP/Oraganizations';

export default function OrganizationsPage() {
    return (
        <div className="flex min-h-screen flex-col bg-cover bg-center">
            <main className="flex-grow">
                <Organizations />
            </main>
        </div>
    );
}
