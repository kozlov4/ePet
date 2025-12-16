import { PetList } from '../../components/CNAP/PetList';

// Mock data for demonstration

export default function PetListPage() {
    return (
        <div className="flex min-h-screen w-screen flex-col bg-cover bg-center">
            <main className="flex-grow">
                <PetList all_fields_to_search={true} />
            </main>
        </div>
    );
}
