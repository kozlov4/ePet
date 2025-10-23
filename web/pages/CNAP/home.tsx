import { HeaderCNAP } from '../../components/CNAP/headerCNAP'
import { MainCNAP } from '../../components/CNAP/mainCNAP'
import { FooterCNAP } from '../../components/CNAP/footer'

export default function CNAPHome() {
    return (
        <div className="flex min-h-screen w-screen flex-col bg-cover bg-center">
            <HeaderCNAP cnapid={6329} />
            <main className="flex-grow">
                <MainCNAP />
            </main>
            <FooterCNAP />
        </div>
    )
}
