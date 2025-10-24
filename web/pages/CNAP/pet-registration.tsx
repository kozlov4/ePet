import { useEffect, useState } from 'react';
import { HeaderCNAP } from '../../components/CNAP/headerCNAP'
import PetRegistrationPage from '../../components/CNAP/petRegistrationPage'

export default function RegisterPet() {

    const [userName, setUserName] = useState('');

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const storedUserName = localStorage.getItem('user_name') || '';
            setUserName(storedUserName);
        }
    }, []);
    return (
        <div className="bg-cover bg-center w-screen h-screen">
            <HeaderCNAP cnapid={userName} />
            <PetRegistrationPage />
        </div>
    )
}
