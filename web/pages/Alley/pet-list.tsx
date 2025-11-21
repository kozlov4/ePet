import { PetList } from '../../components/CNAP/PetList';

export default function OrganizationsPage() {
    return (
        <div className="flex min-h-screen flex-col bg-cover bg-center">
            <main className="flex-grow">
                <PetList />
            </main>
        </div>
    );
}
