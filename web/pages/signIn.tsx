import { Login } from '../components/Auth/Login';

const SignIn = () => {
    return (
        <div
            className="bg-cover bg-center w-screen h-screen"
            style={{ backgroundImage: "url('./SignInBackground.png')" }}
        >
            <Login />
        </div>
    );
};

export default SignIn;
