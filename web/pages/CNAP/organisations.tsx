import { FooterCNAP } from '../../components/CNAP/footer'
import { HeaderCNAP } from '../../components/CNAP/headerCNAP'
import { OrganisationsCNAP } from '../../components/CNAP/organisationsCNAP'
import { useAuth } from '../../hooks/useAuth'

export default function CNAPOrganisations() {
    const { user } = useAuth()
    const userName = user?.name || ''

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
