import { useSearchParams } from 'next/navigation';
import { ResetPasswordPage } from '../components/Auth/ResetPassword';
import { NewPasswordPage } from '../components/Auth/newPassword';

const ResetPassword = () => {
    const searchParams = useSearchParams();
    const token = searchParams.get('token');

    return (
        <div
            className="bg-cover bg-center w-screen h-screen"
            style={{ backgroundImage: "url('./SignInBackground.png')" }}
        >
            {token ? <NewPasswordPage token={token} /> : <ResetPasswordPage />}
        </div>
    );
};

export default ResetPassword;
