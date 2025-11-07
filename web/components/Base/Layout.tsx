import React from 'react'
import { Footer } from './Footer'
import { Header } from './Header/Header'
import { HeaderProps } from './Header/HeaderTypes'


type LayoutProps = {
    children: React.ReactNode
    headerProps?: HeaderProps | null
    showHeader?: boolean
    customHeader?: React.ReactNode
}

export const Layout: React.FC<LayoutProps> = ({ 
    children, 
    headerProps,
    showHeader = true,
    customHeader
}) => {
    const defaultHeaderProps: HeaderProps = {
        navProps: [
            { label: 'Головна', href: '/home' },
            { label: 'Питання та відповіді', href: '/home#faq' },
        ],
        accountName: '',
        buttonProps: {
            label: 'Увійти до кабінету',
            href: '/signIn',
        },
    }

    const finalHeaderProps = headerProps || defaultHeaderProps

    return (
        <div className="w-screen min-h-screen">
            {showHeader && (customHeader || <Header {...finalHeaderProps} />)}
            <main className="w-full max-w-[1340px] mx-auto flex-grow overflow-x-hidden">{children}</main>
            <Footer />
        </div>
    )
}

