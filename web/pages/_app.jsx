import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { Layout } from '../components/Base/Layout';
import { useAuth } from '../hooks/useAuth';
import '../styles/globals.css';

export default function App({ Component, pageProps }) {
    const router = useRouter();
    const { user } = useAuth();
    const [userName, setUserName] = useState('');

    useEffect(() => {
        if (user?.name) {
            setUserName(user.name);
        }
    }, [user]);

    const { headerProps, showHeader, customHeader, ...restPageProps } =
        pageProps;

    const isCNAPPage = router.pathname.startsWith('/CNAP' || '/Alley');

    let finalHeaderProps = headerProps;
    let finalShowHeader = showHeader !== false;

    // Для CNAP страниц используем специальные пропсы для Header
    if (isCNAPPage && !headerProps && !customHeader) {
        finalHeaderProps = {
            navProps: [
                { label: 'Список улюбленців', href: '/CNAP/favorite-list' },
                {
                    label: 'Список організацій',
                    href: '/CNAP/organisations',
                },
            ],
            accountName: userName,
            buttonProps: {
                label: 'Меню',
                href: '/CNAP/menu',
            },
        };
    }

    return (
        <Layout
            headerProps={finalHeaderProps}
            showHeader={finalShowHeader}
            customHeader={customHeader}
        >
            <Component {...restPageProps} />
        </Layout>
    );
}