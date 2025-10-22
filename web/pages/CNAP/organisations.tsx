import { HeaderCNAP } from "../../components/CNAP/HeaderCNAP";
import { OrganisationsCNAP } from "../../components/CNAP/OrganisationsCNAP";
import { FooterCNAP } from "../../components/CNAP/Footer";



export default function CNAPOrganisations() {
    return (

        <div
            className="flex min-h-screen w-screen flex-col bg-cover bg-center">

            <HeaderCNAP cnapid={6329} />
            <main className="flex-grow">
                <OrganisationsCNAP />
            </main>
            <FooterCNAP />
        </div>
    )
}