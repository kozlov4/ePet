import OrganizationRegistration from '../../../components/CNAP/OrganizationRegistration';

export default function OrganizationCreatePage() {
    return (
        <>
            <style jsx global>{`
                footer {
                    display: none !important;
                }
            `}</style>
            <div className="flex min-h-screen flex-col bg-cover bg-center">
                <main className="flex-grow">
                    <OrganizationRegistration />
                </main>
            </div>
        </>
    );
}
