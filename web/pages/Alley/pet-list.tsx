import { PetList } from '../../components/CNAP/PetList';

// Mock data for demonstration

export default function PetListPage() {
    return (
        <div className="flex min-h-screen w-screen flex-col bg-cover bg-center">
            <main className="flex-grow">
                <PetList />
            </main>
        </div>
    );
}
