import PetRegistration from '../../components/CNAP/PetRegistration';
import { Pet } from '../../types/api';

export default function PetRegistrationPage() {
    return (
        <div className="flex min-h-screen w-screen flex-col bg-cover bg-center">
            <main className="flex-grow">
                <PetRegistration Alley={true} />
            </main>
        </div>
    );
}
