import { HeaderMain } from '../components/Base/header'
import { NewPassword } from '../components/ResetPassword/newPassword'
import { MainReset } from '../components/ResetPassword/mainReset'
import { useSearchParams } from 'next/navigation'

export default function SignIn() {
    const searchParams = useSearchParams()
    const token = searchParams.get('token')

    return (
        <div
            className="bg-cover bg-center w-screen h-screen"
            style={{ backgroundImage: "url('./SignInBackground.png')" }}
        >
            <HeaderMain />
            {token ? <NewPassword token={token} /> : <MainReset />}
        </div>
    )
}
