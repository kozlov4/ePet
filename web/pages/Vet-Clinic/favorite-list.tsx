import { FavoriteList } from '../../components/CNAP/FavoriteList';

export default function FavoriteListPage() {
    return (
        <div className="flex min-h-screen w-screen flex-col bg-cover bg-center">
            <main className="flex-grow">
                <FavoriteList />
            </main>
        </div>
    );
}
