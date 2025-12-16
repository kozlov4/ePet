export type HeaderProps = {
    navProps: {
        label: string;
        href: string;
    }[];
    accountName?: string;
    buttonProps: {
        label: string;
        href: string;
        action?: 'app' | 'href';
    };
};
