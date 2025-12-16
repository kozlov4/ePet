import React from 'react';
import { Footer } from './Footer';
import { Header } from './Header/Header';
import { HeaderProps } from './Header/HeaderTypes';

type LayoutProps = {
    children: React.ReactNode;
    headerProps?: HeaderProps | null;
    showHeader?: boolean;
    showFooter?: boolean;
    customHeader?: React.ReactNode;
};

export const Layout: React.FC<LayoutProps> = ({
    children,
    headerProps,
    showHeader = true,
    showFooter = true,
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
        <div className="min-h-screen">
            {showHeader && (customHeader || <Header {...finalHeaderProps} />)}
            <main className="flex-grow">{children}</main>
            {showFooter && <Footer />}
        </div>
    );
};
