import { HeaderCNAP } from '../../components/CNAP/headerCNAP'
import PetRegistrationPage from '../../components/CNAP/petRegistrationPage'
import { useAuth } from '../../hooks/useAuth'

export default function RegisterPet() {
    const { user } = useAuth()
    const userName = user?.name || ''
    return (
        <div className="bg-cover bg-center w-screen h-screen">
            <HeaderCNAP cnapid={userName} />
            <PetRegistrationPage />
        </div>
    )
}
