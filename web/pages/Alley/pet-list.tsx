
import { PetList } from '../../components/CNAP/PetList';

export default function OrganisationsPage() {
    return (
        <div className="flex min-h-screen w-screen flex-col bg-cover bg-center">
            <main className="flex-grow">
                <PetList/>
            </main>
        </div>
    );
}
