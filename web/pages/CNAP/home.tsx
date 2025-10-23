import { HeaderCNAP } from "../../components/CNAP/HeaderCNAP";
import { MainCNAP } from "../../components/CNAP/MainCNAP";
import { FooterCNAP } from "../../components/CNAP/Footer";



export default function CNAPHome() {
    return (
        <div
            className="flex min-h-screen w-screen flex-col bg-cover bg-center">

            <HeaderCNAP cnapid={6329} />
            <main className="flex-grow">
                <MainCNAP />
            </main>
            <FooterCNAP />
        </div>
    )
}