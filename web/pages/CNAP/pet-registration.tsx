import { HeaderCNAP } from '../../components/CNAP/headerCNAP';
import PetRegistrationPage from '../../components/CNAP/petRegistrationPage';

export default function RegisterPet() {
    return (
        <div
            className="bg-cover bg-center w-screen h-screen">

            <HeaderCNAP cnapid={123} />
            <PetRegistrationPage />
        </div>

    );
}