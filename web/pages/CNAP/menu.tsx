import { useAuth } from '../../hooks/useAuth'
import { Menu } from '../../components/CNAP/MenuCnap'
import { Header } from '../../components/Base/Header/Header'




export default function PetInfo() {
    const { user } = useAuth()
    const userName = user?.name || ''

    return (
        <div className="w-[100%] h-[100%]">
            
            <Menu/>
        </div>
    )
}