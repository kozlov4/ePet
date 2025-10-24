import { HeaderCNAP } from '../../components/CNAP/headerCNAP'
import { OrganisationsCNAP } from '../../components/CNAP/organisationsCNAP'
import { FooterCNAP } from '../../components/CNAP/footer'
import { useEffect, useState } from 'react';

export default function CNAPOrganisations() {
    const [userName, setUserName] = useState('');

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const storedUserName = localStorage.getItem('user_name') || '';
            setUserName(storedUserName);
        }
    }, []);

    return (
        <div className="flex min-h-screen w-screen flex-col bg-cover bg-center">
            <HeaderCNAP cnapid={userName} />
            <main className="flex-grow">
                <OrganisationsCNAP />
            </main>
            <FooterCNAP />
        </div>
    )
}
