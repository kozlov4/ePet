import { Menu } from '../../components/CNAP/MenuCnap';

export default function PetInfo() {
    return (
        <>
            <style jsx global>{`
                footer {
                    display: none !important;
                }
            `}</style>
            <div className="w-[100%] h-[100%]">
                <Menu />
            </div>
        </>
    );
}
