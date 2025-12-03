import { FavoriteList } from '../../components/CNAP/FavoriteList';

export default function FavoriteListPage() {
    return (
        <div className="flex min-h-screen flex-col bg-cover bg-center">
            <main className="flex-grow">
                <FavoriteList activeView="cnap" />
            </main>
        </div>
    );
}
