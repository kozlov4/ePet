import Image from 'next/image';
import { useRouter } from 'next/router';
import ArrowBack from '../../assets/images/icons/ArrowBack';

const ExtractSuccess = () => {
    const router = useRouter();
    const { type, pet } = router.query;

    const handleBack = () => {
        router.push('/extract');
    };

    const handleGoHome = () => {
        router.push('/home');
    };

    return (
        <div className="min-h-full bg-white flex-1">
            <div className="max-w-[830px] w-full mx-auto my-12 flex flex-col">
                <div className="flex gap-10 items-center translate-x-[-80px]">
                    <button
                        onClick={handleBack}
                        className="rounded-full bg-black p-2 transition-[0.2s] cursor-pointer hover:bg-gray-300"
                    >
                        <ArrowBack />
                    </button>
                    <p className="text-2xl whitespace-nowrap">
                        Витяг сформовано!
                    </p>
                </div>

                <div className="mt-[180px] flex flex-col items-center">
                    <div className="w-[55px] h-[55px]   flex items-center justify-center mb-6">
                        <Image
                            src={'/success-mark.png'}
                            alt="Success"
                            width={55}
                            height={55}
                        />
                    </div>

                    <h2 className="text-[24px] font-semibold mb-2 text-center">
                        Витяг створено успішно!
                    </h2>

                    <p className="text-[13px] text-gray-700 text-center mb-8 max-w-lg">
                        Документ про пухнастого буде надіслано найближчим часом
                        вам на email
                    </p>
                </div>
            </div>
        </div>
    );
};

export default ExtractSuccess;
