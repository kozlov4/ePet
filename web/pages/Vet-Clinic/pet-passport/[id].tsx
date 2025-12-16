import { PetPassport } from '../../../components/CNAP/PetPassport';

export default function PetPasssport() {
    return (
        <>
            <style jsx global>{`
                footer {
                    display: none !important;
                }
            `}</style>
            <PetPassport />
        </>
    );
}
