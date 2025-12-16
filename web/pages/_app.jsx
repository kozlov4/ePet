import { useRouter } from 'next/router';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Layout } from '../components/Base/Layout';
import { AuthProvider } from '../hooks/AuthProvider';
import { useAuth } from '../hooks/useAuth';
import '../styles/globals.css';

export default function App({ Component, pageProps }) {
    return (
        <AuthProvider>
            {' '}
            <AppContent Component={Component} pageProps={pageProps} />
        </AuthProvider>
    );
}

function AppContent({ Component, pageProps }) {
    const router = useRouter();
    const { user } = useAuth();

    const { headerProps, showHeader, customHeader, ...restPageProps } =
        pageProps;

    const isCNAPPage = router.pathname.startsWith('/CNAP');
    const isAllay = router.pathname.startsWith('/Alley');
    const isVet = router.pathname.startsWith('/Vet-Clinic');

    let finalHeaderProps = headerProps;
    let finalShowHeader = showHeader !== false;

    if (isCNAPPage && !headerProps && !customHeader) {
        finalHeaderProps = {
            navProps: [
                { label: 'Список улюбленців', href: '/CNAP/favorite-list' },
                {
                    label: 'Список організацій',
                    href: '/CNAP/organizations',
                },
            ],
            accountName: user?.name || '',
            buttonProps: {
                label: 'Меню',
                href: '/CNAP/menu',
            },
        };
    } else if (isAllay && !headerProps && !customHeader) {
        finalHeaderProps = {
            navProps: [
                { label: 'Список тварин', href: '/Alley/pet-list' },
                {
                    label: 'Повідомлення',
                    href: '/Alley/notifications',
                },
            ],
            accountName: user?.name || '',
            buttonProps: {
                label: 'Меню',
                href: '/Alley/menu',
            },
        };
    } else if (isVet && !headerProps && !customHeader) {
        finalHeaderProps = {
            navProps: [
                {
                    label: 'Список улюбленців',
                    href: '/Vet-Clinic/favorite-list',
                },
            ],
            accountName: user?.name || '',
            buttonProps: {
                label: 'Меню',
                href: '/Vet-Clinic/menu',
            },
        };
    }

    return (
        <>
            <Layout
                headerProps={finalHeaderProps}
                showHeader={finalShowHeader}
                customHeader={customHeader}
            >
                <Component {...restPageProps} />
            </Layout>
            <ToastContainer
                position="top-right"
                autoClose={2000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
            />
        </>
    );
}
