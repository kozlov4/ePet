import React from 'react';
import { HeaderProps } from '../Base/Header/HeaderTypes';
import { Footer } from './Footer';
import { Header } from './Header/Header';

type LayoutProps = {
    children: React.ReactNode;
    headerProps?: HeaderProps | null;
    showHeader?: boolean;
    customHeader?: React.ReactNode;
};

export const Layout: React.FC<LayoutProps> = ({
    children,
    headerProps,
    showHeader = true,
    customHeader,
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
    };

    const finalHeaderProps = headerProps || defaultHeaderProps;

    return (
        <div className="min-h-screen flex flex-col">
            {showHeader && (customHeader || <Header {...finalHeaderProps} />)}
            <main className="flex-grow flex flex-col">{children}</main>
            <Footer />
        </div>
    );
};
