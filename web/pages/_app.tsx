import { AppProps } from 'next/app';
import { useRouter } from 'next/router';
import { Layout } from '../components/Base/Layout';
import { ErrorBoundary } from '../components/ErrorBoundary';
import { AuthProvider } from '../hooks/AuthProvider';
import { useAuth } from '../hooks/useAuth';
import '../styles/globals.css';

export default function App({ Component, pageProps }: AppProps) {
    return (
        <ErrorBoundary>
            <AuthProvider>
                <AppContent Component={Component} pageProps={pageProps} />
            </AuthProvider>
        </ErrorBoundary>
    );
}

function AppContent({
    Component,
    pageProps,
}: {
    Component: AppProps['Component'];
    pageProps: AppProps['pageProps'];
}) {
    const router = useRouter();
    const { user, organizationType } = useAuth();

    const componentConfig = Component as any;

    const {
        headerProps: pageHeaderProps,
        showHeader: pageShowHeader,
        showFooter: pageShowFooter,
        customHeader: pageCustomHeader,
        ...restPageProps
    } = pageProps as any;

    const headerProps = componentConfig.headerProps ?? pageHeaderProps;
    const showHeader = componentConfig.showHeader ?? pageShowHeader;
    const showFooter = componentConfig.showFooter ?? pageShowFooter;
    const customHeader = componentConfig.customHeader ?? pageCustomHeader;

    const routeHeaderConfig: Record<
        string,
        {
            navProps: Array<{ label: string; href: string }>;
            menuHref: string;
            buttonLabel?: string;
            buttonAction?: 'app' | 'href';
        }
    > = {
        '/CNAP': {
            navProps: [
                { label: 'Список улюбленців', href: '/CNAP/favorite-list' },
                { label: 'Список організацій', href: '/CNAP/organizations' },
            ],
            menuHref: '/CNAP/menu',
        },
        '/Alley': {
            navProps: [
                { label: 'Список тварин', href: '/Alley/pet-list' },
                { label: 'Повідомлення', href: '/Alley/notifications' },
            ],
            menuHref: '/Alley/menu',
        },
        '/Vet-Clinic': {
            navProps: [
                {
                    label: 'Список улюбленців',
                    href: '/Vet-Clinic/favorite-list',
                },
            ],
            menuHref: '/Vet-Clinic/menu',
        },
        '/extract': {
            navProps: [
                { label: 'Головна', href: '/home' },
                { label: 'Витяги', href: '/extract' },
                { label: 'Питання та відповіді', href: '/home#faq' },
            ],
            menuHref: '/home',
        },
    };

    const sortedRoutes = Object.keys(routeHeaderConfig).sort(
        (a, b) => b.length - a.length,
    );
    const routePrefix = sortedRoutes.find((prefix) =>
        router.pathname.startsWith(prefix),
    );
    const routeConfig = routePrefix ? routeHeaderConfig[routePrefix] : null;

    const isRegularUser =
        organizationType === 'user' || organizationType === null;

    const shouldShowUserHeader =
        router.pathname === '/home' && isRegularUser && user;

    const finalHeaderProps =
        headerProps ||
        (shouldShowUserHeader && !customHeader
            ? {
                  navProps: [
                      { label: 'Головна', href: '/home' },
                      { label: 'Витяги', href: '/extract' },
                      { label: 'Питання та відповіді', href: '/home#faq' },
                  ],
                  accountName: user?.name || '',
                  buttonProps: {
                      label: 'Перейти в додаток',
                      href: '/home',
                      action: 'app',
                  },
              }
            : routeConfig && !customHeader
            ? {
                  navProps: routeConfig.navProps,
                  accountName: user?.name || '',
                  buttonProps: {
                      label:
                          routeConfig.buttonLabel ||
                          (isRegularUser ? 'Перейти в додаток' : 'Меню'),
                      href: routeConfig.menuHref,
                      action:
                          routeConfig.buttonAction ||
                          (isRegularUser ? 'app' : 'href'),
                  },
              }
            : null);

    const finalShowHeader = showHeader !== false;
    const finalShowFooter = showFooter !== false;

    return (
        <Layout
            headerProps={finalHeaderProps}
            showHeader={finalShowHeader}
            showFooter={finalShowFooter}
            customHeader={customHeader}
        >
            <Component {...restPageProps} />
        </Layout>
    );
}
