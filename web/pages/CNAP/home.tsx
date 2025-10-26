import { FooterCNAP } from '../../components/CNAP/footer';
import { HeaderCNAP } from '../../components/CNAP/headerCNAP';
import { MainCNAP } from '../../components/CNAP/mainCNAP';
import { useAuth } from '../../hooks/useAuth';

export default function CNAPHome() {
    const { user } = useAuth()
    const userName = user?.name || ''

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
