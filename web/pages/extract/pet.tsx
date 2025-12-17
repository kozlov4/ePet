import router, { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import ArrowBack from '../../assets/images/icons/ArrowBack';
import { PetSlider } from '../../components/ui/PetSlider';
import { isAuthError } from '../../utils/auth';
import { devError } from '../../utils/config';
import { ExtractType, fetchUserPets, generateExtract } from '../../utils/pets';

interface Pet {
    id: number;
    name: string;
    nameEn: string;
}

interface ExtractTypeDetails {
    type: ExtractType;
    description: string[];
}

const EXTRACT_DETAILS: Record<ExtractType, ExtractTypeDetails> = {
    'Витяг з реєстру домашніх тварин': {
        type: 'Витяг з реєстру домашніх тварин',
        description: [
            "Ім'я тварини",
            'Вид',
            'Порода',
            'Стать',
            'Дата народження',
            'Колір',
            'Фото',
            'Інформація про ЦНАП, який видав паспорт',
            'Інформація про власника',
        ],
    },
    'Медичний витяг про проведені щеплення тварини': {
        type: 'Медичний витяг про проведені щеплення тварини',
        description: [
            'Список проведених щеплень',
            'Виробник препарату',
            'Назва препарату',
            'Серія препарату',
            'Дата вакцинації',
            'Термін дії вакцинації',
            'Назва організації, яка проводила щеплення',
        ],
    },
    'Офіційний витяг про ідентифікаційні дані тварини': {
        type: 'Офіційний витяг про ідентифікаційні дані тварини',
        description: [
            'Тип ідентифікатора',
            'Номер ідентифікатора',
            'Дата встановлення ідентифікатора',
            'Дані тварини',
            'Інформація про ЦНАП, що встановив ідентифікатор',
        ],
    },
};

const PetExtract = () => {
    const routerInstance = useRouter();
    const [selectedPet, setSelectedPet] = useState<Pet | null>(null);
    const [selectedExtractType, setSelectedExtractType] =
        useState<ExtractType | null>(null);
    const [pets, setPets] = useState<Pet[]>([]);
    const [loading, setLoading] = useState(true);
    const [generating, setGenerating] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    useEffect(() => {
        // Read extract type from query parameter
        const extractType = routerInstance.query.type as string;
        if (extractType) {
            const decodedType = decodeURIComponent(extractType) as ExtractType;
            setSelectedExtractType(decodedType);
        }
    }, [routerInstance.query.type]);

    useEffect(() => {
        const loadPets = async () => {
            try {
                setLoading(true);
                const userPets = await fetchUserPets();
                // Transform API response to Pet format
                const transformedPets: Pet[] = userPets.map((pet) => ({
                    id: pet.pet_id,
                    name: pet.pet_name,
                    nameEn: pet.pet_name_en || pet.pet_name,
                }));
                setPets(transformedPets);
            } catch (err) {
                devError('Error fetching pets:', err);
                // Don't show error message if it's an auth error - user will be redirected
                if (!isAuthError(err)) {
                    setError(
                        err instanceof Error
                            ? err.message
                            : 'Помилка завантаження улюбленців',
                    );
                }
            } finally {
                setLoading(false);
            }
        };

        loadPets();
    }, []);

    const handleBack = () => {
        router.back();
    };

    const handlePetSelect = (pet: Pet) => {
        setSelectedPet(pet);
        setError(null);
        setSuccessMessage(null);
    };

    const handleGenerate = async () => {
        if (!selectedPet || !selectedExtractType) {
            return;
        }

        try {
            setGenerating(true);
            setError(null);
            setSuccessMessage(null);

            await generateExtract({
                pet_id: selectedPet.id,
                name_document: selectedExtractType,
            });

            // Navigate to success page
            router.push(
                `/extract/success?type=${encodeURIComponent(
                    selectedExtractType,
                )}&pet=${selectedPet.name}`,
            );
        } catch (err) {
            devError('Error generating extract:', err);
            if (!isAuthError(err)) {
                setError(
                    err instanceof Error
                        ? err.message
                        : 'Помилка генерації витягу',
                );
            }
        } finally {
            setGenerating(false);
        }
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
                        Витяг про улюбленця
                    </p>
                </div>

                {selectedExtractType && (
                    <div className="mt-8 mb-6">
                        <div className="text-[16px]">
                            <p className="mb-6 ">
                                Документ містить актуальні дані про обрану
                                тварину:
                            </p>
                            <ul className="list-disc list-inside ">
                                {EXTRACT_DETAILS[
                                    selectedExtractType
                                ]?.description.map((item, idx) => (
                                    <li key={idx}>{item}</li>
                                ))}
                            </ul>
                        </div>
                    </div>
                )}

                <p className="text-[16px] mt-[10px] mb-[58px]">
                    Витяг підтверджує стан тварини на момент формування
                    документа.
                </p>
                <p className="text-[20px] mt-11 mb-6">Оберіть улюбленця</p>
                <div className="mb-8">
                    {loading ? (
                        <div className="text-center py-8">Завантаження...</div>
                    ) : error && !selectedPet ? (
                        <div className="text-center py-8 text-red-500">
                            {error}
                        </div>
                    ) : pets.length === 0 ? (
                        <div className="text-center py-8 text-gray-500">
                            У вас немає зареєстрованих улюбленців
                        </div>
                    ) : (
                        <PetSlider pets={pets} onPetSelect={handlePetSelect} />
                    )}
                </div>

                {selectedExtractType && (
                    <>
                        {error && (
                            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-800">
                                {error}
                            </div>
                        )}

                        <button
                            onClick={handleGenerate}
                            disabled={generating}
                            className="w-full rounded-[10em] bg-black px-6 py-3 text-lg font-semibold text-white shadow-md transition-colors hover:bg-gray-800 disabled:bg-gray-400 disabled:cursor-not-allowed cursor-pointer"
                        >
                            {generating ? 'Генерація витягу...' : 'Розпочати'}
                        </button>
                    </>
                )}
            </div>
        </div>
    );
};

export default PetExtract;
PetExtract.showFooter = false;
