import { useState } from 'react'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { motion } from 'framer-motion'

export function MainSignIn() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [emailError, setEmailError] = useState('')
    const [passwordError, setPasswordError] = useState('')

    const validateEmail = (value) => {
        if (!value) return ''
        if (value.length > 30) return 'Максимум 30 символів'
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(value)) return 'Невірний формат електронної пошти'
        return ''
    }

    const validatePassword = (value) => {
        if (!value) return ''
        if (value.length < 8) return 'Пароль повинен містити мінімум 8 символів'
        if (!/[A-Z]/.test(value))
            return 'Пароль повинен містити хоча б одну велику літеру'
        return ''
    }

    const handleSubmit = async () => {
        const emailErr = validateEmail(email)
        const passwordErr = validatePassword(password)
        setEmailError(emailErr)
        setPasswordError(passwordErr)

        if (!emailErr && !passwordErr) {
            try {
                const formData = {
                    grant_type: 'password',
                    username: email,
                    password: password,
                }

                const formBody = new URLSearchParams(formData)

                const response = await fetch('https://upcity.live/login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                        Accept: 'application/json',
                    },
                    body: formBody.toString(),
                })

                const data = await response.json()
                console.log('Response:', data)

                if (data.detail === 'Organization not found.') {
                    toast.error('Організація не знайдена.', {
                        position: 'top-center',
                        autoClose: 2000,
                        hideProgressBar: true,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                    })
                } else if (data.access_token) {
                    toast.success('Успішний вхід!', {
                        position: 'top-center',
                        autoClose: 2000,
                        hideProgressBar: true,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                    })

                    localStorage.setItem('access_token', data.access_token)
                    localStorage.setItem('user_name', data.user_name)

                    setTimeout(() => {
                        window.location.href = '/dashboard'
                    }, 2000)
                } else {
                    toast.error('Помилка входу. Перевірте дані.', {
                        position: 'top-center',
                        autoClose: 2000,
                        hideProgressBar: true,
                    })
                }
            } catch (error) {
                console.error('Error:', error)
                toast.error("Помилка з'єднання з сервером.", {
                    position: 'top-center',
                    autoClose: 2000,
                    hideProgressBar: true,
                })
            }
        }
    }

    const isFormValid =
        !validateEmail(email) &&
        !validatePassword(password) &&
        email &&
        password

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
                    className="w-full h-[70%] flex flex-col justify-center items-start p-4 rounded-xl"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, delay: 0.3 }}
                >
                    <input
                        type="email"
                        placeholder="Електронна адреса"
                        value={email}
                        onChange={(e) => {
                            setEmail(e.target.value)
                            setEmailError(validateEmail(e.target.value))
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
                            setPassword(e.target.value)
                            setPasswordError(validatePassword(e.target.value))
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
                        href="/resetPassword"
                        className="
                      flex w-[90%] justify-end
                      font-medium text-[15px] underline decoration-slate-600 decoration-solid decoration-skip-ink-none text-[#606060]
                      transition-all duration-300 ease-in-out
                      hover:text-[#1e88e5] h
                      active:scale-95 active:text-[#0d47a1]
                    "
                    >
                        Забули пароль?
                    </a>
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
    )
}
