import { HeaderCNAP } from '../../components/CNAP/headerCNAP'
import { MainCNAP } from '../../components/CNAP/mainCNAP'
import { FooterCNAP } from '../../components/CNAP/footer'

export default function CNAPHome() {
    const user_name: string = localStorage.getItem('user_name');
    return (
        <div className="flex min-h-screen w-screen flex-col bg-cover bg-center">
            <HeaderCNAP cnapid={user_name} />
            <main className="flex-grow">
                <MainCNAP />
            </main>
            <FooterCNAP />
        </div>
    )
}
