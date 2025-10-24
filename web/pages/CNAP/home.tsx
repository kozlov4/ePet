import React, { useState, useEffect } from 'react';
import { HeaderCNAP } from '../../components/CNAP/headerCNAP'
import { MainCNAP } from '../../components/CNAP/mainCNAP'
import { FooterCNAP } from '../../components/CNAP/footer'

export default function CNAPHome() {
    
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
                <MainCNAP />
            </main>
            <FooterCNAP />
        </div>
    )
}
