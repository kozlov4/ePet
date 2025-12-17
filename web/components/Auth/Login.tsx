import { motion } from 'framer-motion';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useAuth } from '../../hooks/useAuth';
import { authService } from '../../services/authService';
import { devError, devLog } from '../../utils/config';
import { ORGANIZATION_TYPES, ROUTES, VALIDATION_MESSAGES } from '../../utils/constants';

export function Login() {
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [emailError, setEmailError] = useState<string>('');
    const [passwordError, setPasswordError] = useState<string>('');
    const router = useRouter();
    const { login } = useAuth();
    const [message, setMessage] = useState<string>('');

    const validateEmail = (value: string): string => {
        if (!value) return '';
        // Removed arbitrary 30 character limit - standard emails can be longer
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) return VALIDATION_MESSAGES.EMAIL_INVALID;
        return '';
    };

    const validatePassword = (value: string): string => {
        // Password validation can be added here if needed
        // For now, returning empty string (no validation)
        return '';
    };

    const handleSubmit = async (): Promise<void> => {
        const emailErr = validateEmail(email);
        const passwordErr = validatePassword(password);
        setEmailError(emailErr);
        setPasswordError(passwordErr);

        if (!emailErr && !passwordErr) {
            try {
                const data = await authService.login(email, password);
                devLog('Response:', data);

                if (data.detail === 'Organization not found.') {
                    setMessage(VALIDATION_MESSAGES.AUTH_ERROR);
                } else if (data.access_token) {
                    const orgType = data.organization_type || ORGANIZATION_TYPES.USER;
                    login({ name: data.user_name }, data.access_token, orgType);
                    
                    if (data.organization_type === ORGANIZATION_TYPES.VET_CLINIC)
                        router.push(ROUTES.VET_CLINIC_HOME);
                    else if (data.organization_type === ORGANIZATION_TYPES.CNAP)
                        router.push(ROUTES.CNAP_HOME);
                    else if (data.organization_type === ORGANIZATION_TYPES.SHELTER)
                        router.push(ROUTES.SHELTER_HOME);
                    else if (data.organization_type == null)
                        router.push(ROUTES.HOME);
                } else {
                    setMessage(VALIDATION_MESSAGES.AUTH_ERROR);
                }
            } catch (error) {
                devError(error);
                setMessage(VALIDATION_MESSAGES.AUTH_ERROR);
            }
        }
    };

    const isFormValid =
        !validateEmail(email) &&
        !validatePassword(password) &&
        email &&
        password;

    return (
        <div className="w-[50%] h-full flex bg-white">
            <div className="w-full h-[50%] mt-[25%] mx-[8%]">
                <motion.h1
                    className="font-medium ml-[3%] text-5xl mb-6"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    Увійти до кабінету
                </motion.h1>

                <motion.div
                    className="w-full h-[75%] flex flex-col justify-center items-start p-4 rounded-xl"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, delay: 0.3 }}
                >
                    <input
                        type="email"
                        placeholder="Електронна адреса"
                        value={email}
                        onChange={(e) => {
                            setEmail(e.target.value);
                            setEmailError(validateEmail(e.target.value));
                        }}
                        className={`w-full h-[30%] px-4 py-2 font-normal text-[20px] border rounded-xl focus:outline-none focus:ring-2 ${
                            emailError
                                ? 'border-red-500 ring-red-500 text-red-500'
                                : 'border-[#e6e6e6] ring-blue-500 text-black'
                        }`}
                    />
                    {emailError && (
                        <p className="text-red-500 text-sm mt-1 text-left">
                            {emailError}
                        </p>
                    )}

                    <input
                        type="password"
                        placeholder="Пароль"
                        value={password}
                        onChange={(e) => {
                            setPassword(e.target.value);
                            setPasswordError(validatePassword(e.target.value));
                        }}
                        className={`w-full h-[30%] px-4 py-2 shadow-xl border rounded-xl font-normal text-[20px] focus:outline-none focus:ring-2 ${
                            passwordError
                                ? 'border-red-500 ring-red-500 text-red-500'
                                : 'border-[#e6e6e6] ring-blue-500 text-black'
                        }`}
                    />
                    {passwordError && (
                        <p className="text-red-500 text-sm mt-1 text-left">
                            {passwordError}
                        </p>
                    )}
                    <a
                        href="/reset-password"
                        className="
                      flex w-[94%] justify-end
                      font-medium text-[15px] underline decoration-slate-600 decoration-solid decoration-skip-ink-none text-[#606060]
                      transition-all duration-300 ease-in-out
                      hover:text-[#1e88e5]
                      active:scale-95 active:text-[#0d47a1]
                    "
                    >
                        Забули пароль?
                    </a>

                    {message && (
                        <span
                            className={`flex w-full justify-center text-center text-[14px] mt-2 text-red-500`}
                        >
                            {message}
                        </span>
                    )}
                </motion.div>

                <motion.button
                    onClick={handleSubmit}
                    disabled={!isFormValid}
                    className={`w-full h-[15%] mt-[5%] flex font-medium text-xl cursor-pointer justify-center items-center rounded-3xl transition-all duration-300 ease-in-out ${
                        isFormValid
                            ? 'bg-black text-white hover:bg-[#1e88e5] hover:shadow-lg hover:scale-[1.03] active:scale-[0.98]'
                            : 'bg-gray-700 text-gray-200 cursor-not-allowed'
                    }`}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8, delay: 0.6 }}
                >
                    Увійти
                </motion.button>
            </div>

            <ToastContainer />
        </div>
    );
    
}

Login.showFotter = false
