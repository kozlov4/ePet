import { useSearchParams } from 'next/navigation';
import { NewPasswordPage } from '../components/Auth/NewPassword';
import { ResetPasswordPage } from '../components/Auth/ResetPassword';
import { BoneIcon } from '../assets/images/icons/BoneIcon';

const ResetPassword = () => {
    const searchParams = useSearchParams();
    const token = searchParams.get('token');

    return (
        <div
            className="bg-cover bg-center w-screen h-screen"
            style={{ backgroundImage: "url('./SignInBackground.png')" }}
        >
            <div className="absolute right-40 top-2/7 -translate-y-1/2 scale-50 rotate-80"><BoneIcon/></div>
                        <div className="absolute right-2/7 top-5/8 -translate-y-1/2 scale-50 rotate-180"><BoneIcon/></div>
                        <div className="absolute right-1/30 top-8/10 -translate-y-1/2 scale-50 rotate-180"><BoneIcon/></div>
            {token ? <NewPasswordPage token={token} /> : <ResetPasswordPage />}
        </div>
    );
};

export default ResetPassword;
