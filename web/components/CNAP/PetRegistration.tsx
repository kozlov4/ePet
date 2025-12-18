'use client';

import { AnimatePresence, motion } from 'framer-motion';
import Image from 'next/image';
import { useRouter } from 'next/router';
import React, { useRef, useState } from 'react';
import ArrowBack from '../../assets/images/icons/ArrowBack';

import ReactCrop, {
    type Crop,
    type PixelCrop,
    centerCrop,
    makeAspectCrop,
} from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import { PetPassportData } from '../../types/api';
import { petService } from '../../services/petService';
import { devError, devLog } from '../../utils/config';
import { toIsoDateInput } from '../../utils/date';
import { getCroppedImg } from '../../utils/getCroppedImg';
import InputField from '../ui/InputField';

type ModalState = {
    message: string;
    type: 'success' | 'error';
    onClose?: () => void;
};

export default function PetRegistration({
    pet,
    Alley,
}: {
    pet?: PetPassportData;
    Alley?: Boolean;
}) {
    const formatValidationErrorMessage = (raw: string): string | null => {
        const fieldLabels: Record<string, string> = {
            pet_name: "Ім'я",
            gender: 'Стать',
            breed: 'Порода',
            species: 'Вид',
            color: 'Масть (Колір)',
            date_of_birth: 'Дата народження',
            identifier_type: 'Місце розташування ідентифікатора',
            identifier_number: 'Номер ідентифікатора',
            chip_date: 'Дата чіпування',
            owner_passport_number: 'Номер паспорта власника',
        };

        const matches = [...raw.matchAll(/\b([a-zA-Z_]+):\s*/g)];
        if (matches.length < 2) {
            return null;
        }

        const items: Array<{ field: string; text: string }> = [];

        for (let i = 0; i < matches.length; i++) {
            const field = matches[i][1];
            const start = (matches[i].index ?? 0) + matches[i][0].length;
            const end =
                i + 1 < matches.length
                    ? matches[i + 1].index ?? raw.length
                    : raw.length;
            const text = raw
                .slice(start, end)
                .trim()
                .replace(/^,\s*/, '')
                .replace(/,\s*$/, '');
            if (text) {
                items.push({ field, text });
            }
        }

        if (items.length === 0) {
            return null;
        }

        const formatted = items
            .map(({ field, text }) => {
                const label = fieldLabels[field] || field;
                return `- ${label}: ${text}`;
            })
            .join('\n');

        return `Перевірте введені дані:\n${formatted}`;
    };

    const router = useRouter();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [petData, setPetData] = useState({
        pet_name: pet?.pet_name || '',
        gender: pet?.gender || '',
        breed: pet?.breed || '',
        species: pet?.species || '',
        color: pet?.color || '',
        date_of_birth: toIsoDateInput(pet?.date_of_birth, true),
        identifier_type: '',
        identifier_number: '',
        chip_date: '',
        owner_passport_number: '',
    });

    const [petFile, setPetFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(
        pet?.img_url || null,
    );
    const [loading, setLoading] = useState(false);
    const [modalState, setModalState] = useState<ModalState | null>(null);

    const imgRef = useRef<HTMLImageElement>(null);
    const [imgSrc, setImgSrc] = useState<string>('');
    const [isCropping, setIsCropping] = useState(false);
    const [crop, setCrop] = useState<Crop>();
    const [completedCrop, setCompletedCrop] = useState<PixelCrop>();
    const isEditMode = Boolean(pet?.pet_id);

    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
    ) => {
        const { name, value } = e.target;
        setPetData((prevData) => ({ ...prevData, [name]: value }));
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImgSrc(reader.result as string);
                setIsCropping(true);
            };
            reader.readAsDataURL(file);
        }
        if (e.target) {
            e.target.value = '';
        }
    };

    const handleImagePlaceholderClick = () => {
        fileInputRef.current?.click();
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!petFile && !imagePreview) {
            setModalState({
                message: 'Будь ласка, завантажте фото улюбленця.',
                type: 'error',
            });
            return;
        }

        const validationRules = [
            { key: 'pet_name', min: 3, label: "Ім'я" },
            { key: 'gender', min: 1, label: 'Стать' },
            { key: 'breed', min: 3, label: 'Порода' },
            { key: 'species', min: 3, label: 'Вид' },
            { key: 'color', min: 3, label: 'Масть (Колір)' },
            { key: 'date_of_birth', min: 1, label: 'Дата народження' },
            {
                key: 'identifier_type',
                min: Alley ? 0 : 3,
                label: 'Місце розташування ідентифікатора',
            },
            {
                key: 'identifier_number',
                min: Alley ? 0 : 3,
                label: 'Номер ідентифікатора',
            },
            { key: 'chip_date', min: Alley ? 0 : 1, label: 'Дата чіпування' },
            {
                key: 'owner_passport_number',
                min: Alley ? 0 : 3,
                label: 'Номер паспорта власника',
            },
        ];

        for (const rule of validationRules) {
            const value =
                petData[rule.key as keyof typeof petData]?.trim() || '';

            if (rule.min >= 1 && value.length === 0) {
                setModalState({
                    message: `Будь ласка, заповніть поле "${rule.label}".`,
                    type: 'error',
                });
                return;
            }

            if (value.length > 0 && value.length < rule.min) {
                setModalState({
                    message: `Поле "${rule.label}" має містити щонайменше ${rule.min} символів.`,
                    type: 'error',
                });
                return;
            }
        }

        setLoading(true);

        const formData = new FormData();
        formData.append('file', petFile as Blob);

        (Object.keys(petData) as Array<keyof typeof petData>).forEach((key) => {
            formData.append(key, petData[key]);
        });

        devLog(
            'Registering pet with data:',
            Object.fromEntries(formData.entries()),
        );

        try {
            const token = localStorage.getItem('access_token');
            if (!token) {
                setModalState({
                    message:
                        'Помилка автентифікації. Будь ласка, увійдіть знову.',
                    type: 'error',
                    onClose: () => router.push('/login'),
                });
                setLoading(false);
                return;
            }

            const data = isEditMode
                ? await petService.updatePet(pet!.pet_id, formData)
                : await petService.registerPet(formData);

            if (
                data.detail ===
                'Не вдалося знайти власника з вказаним паспортом.'
            ) {
                setModalState({
                    message: data.detail,
                    type: 'error',
                });
                setLoading(false);
                return;
            }

            setModalState({
                message: `Улюбленець успішно ${
                    isEditMode ? 'оновлений' : 'зареєстрований'
                }!`,
                type: 'success',
                onClose: () => router.back(),
            });
        } catch (error) {
            devError('Error registering pet:', error);
            const rawMessage =
                error instanceof Error
                    ? error.message
                    : "Помилка з'єднання з сервером.";
            const prettyMessage =
                typeof rawMessage === 'string'
                    ? formatValidationErrorMessage(rawMessage)
                    : null;
            setModalState({
                message: prettyMessage || rawMessage,
                type: 'error',
            });
        } finally {
            setLoading(false);
        }
    };

    const closeModal = () => {
        if (modalState?.onClose) {
            modalState.onClose();
        }
        setModalState(null);
    };

    function onImageLoad(e: React.SyntheticEvent<HTMLImageElement>) {
        const { width, height } = e.currentTarget;
        const crop = centerCrop(
            makeAspectCrop(
                {
                    unit: '%',
                    width: 90,
                },
                3 / 4,
                width,
                height,
            ),
            width,
            height,
        );
        setCrop(crop);
    }

    const onCropCancel = () => {
        setIsCropping(false);
        setImgSrc('');
        setCrop(undefined);
        setCompletedCrop(undefined);
    };

    const onCropSave = async () => {
        if (completedCrop && imgRef.current) {
            try {
                const originalFileName =
                    fileInputRef.current?.files?.[0]?.name ||
                    'cropped-image.jpg';

                const croppedFile = await getCroppedImg(
                    imgRef.current,
                    completedCrop,
                    originalFileName,
                );

                setPetFile(croppedFile);

                if (imagePreview) {
                    URL.revokeObjectURL(imagePreview);
                }
                setImagePreview(URL.createObjectURL(croppedFile));

                onCropCancel();
            } catch (e) {
                devError('Помилка при обрізці фото:', e);
                onCropCancel();
                setModalState({
                    message: 'Не вдалося обрізати фото. Спробуйте інше.',
                    type: 'error',
                });
            }
        }
        const pageVariants = {
            hidden: { opacity: 0, y: 24 },
            visible: {
                opacity: 1,
                y: 0,
                transition: {
                    duration: 0.45,
                    ease: 'easeOut',
                    when: 'beforeChildren',
                    staggerChildren: 0.08,
                },
            },
        };

        const blockVariants = {
            hidden: { opacity: 0, y: 16 },
            visible: {
                opacity: 1,
                y: 0,
                transition: { duration: 0.3, ease: 'easeOut' },
            },
        };
    };
    return (
        <motion.div
            className="w-full pt-10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
        >
            <AnimatePresence>
                {modalState && (
                    <motion.div
                        className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 backdrop-blur-sm"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        <motion.div
                            className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md mx-4"
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            transition={{ duration: 0.2 }}
                        >
                            <h3
                                className={`text-xl font-semibold ${
                                    modalState.type === 'success'
                                        ? 'text-green-600'
                                        : 'text-red-600'
                                }`}
                            >
                                {modalState.type === 'success'
                                    ? 'Успіх!'
                                    : 'Помилка'}
                            </h3>

                            <div className="mt-3 max-h-64 overflow-auto rounded-md bg-gray-50 p-3">
                                <p className="text-sm leading-6 text-gray-800 whitespace-pre-line">
                                    {modalState.message}
                                </p>
                            </div>

                            <div className="mt-6 flex justify-end">
                                <motion.button
                                    onClick={closeModal}
                                    className="px-5 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    OK
                                </motion.button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            <AnimatePresence>
                {isCropping && (
                    <motion.div
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        <motion.div
                            className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md mx-4"
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            transition={{ duration: 0.2 }}
                        >
                            <h3 className="text-xl font-semibold text-gray-900 mb-4">
                                Обріжте фото (3x4)
                            </h3>

                            <div className="max-h-[60vh] overflow-auto">
                                <ReactCrop
                                    crop={crop}
                                    onChange={(c, percentCrop) =>
                                        setCrop(percentCrop)
                                    }
                                    onComplete={(c) => setCompletedCrop(c)}
                                    aspect={3 / 4}
                                >
                                    <img
                                        ref={imgRef}
                                        src={imgSrc}
                                        alt="Crop me"
                                        style={{
                                            maxHeight: '60vh',
                                            width: 'auto',
                                        }}
                                        onLoad={onImageLoad}
                                    />
                                </ReactCrop>
                            </div>

                            <div className="mt-6 flex justify-end gap-4">
                                <motion.button
                                    type="button"
                                    onClick={onCropCancel}
                                    className="px-5 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
                                    whileHover={{ scale: 1.04 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    Скасувати
                                </motion.button>

                                <motion.button
                                    type="button"
                                    onClick={onCropSave}
                                    className="px-5 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    Зберегти
                                </motion.button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            <motion.div
                className="mb-8 flex items-center justify-center max-w-4xl mx-auto"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.1 }}
            >
                <div className="flex items-center w-full">
                    <motion.button
                        onClick={() => router.back()}
                        className="mr-4 rounded-full bg-black p-2 cursor-pointer hover:bg-gray-300"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <ArrowBack />
                    </motion.button>

                    <h1 className="text-2xl font-semibold text-gray-800">
                        {`${
                            pet?.pet_id
                                ? 'Оновлення інформації про'
                                : 'Реєстрація'
                        } улюбленця`}
                    </h1>
                </div>
            </motion.div>

            <motion.div
                className="w-full max-w-4xl mx-auto rounded-xl bg-[rgba(217,217,217,0.27)] p-6 shadow-lg sm:p-8 lg:p-10"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
            >
                <form
                    onSubmit={handleSubmit}
                    className="grid grid-cols-1 gap-8 md:grid-cols-2"
                >
                    <motion.div
                        className="flex flex-col items-center"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                    >
                        <motion.div
                            className="relative flex w-full max-w-[240px] aspect-[3/4] cursor-pointer items-center justify-center rounded-xl border-2 border-dashed border-gray-300 bg-gray-100 hover:bg-gray-200"
                            onClick={handleImagePlaceholderClick}
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.97 }}
                        >
                            {imagePreview ? (
                                <Image
                                    src={imagePreview}
                                    alt="Pet Preview"
                                    layout="fill"
                                    objectFit="cover"
                                    className="rounded-xl"
                                />
                            ) : (
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-16 w-16 text-gray-400"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                                    />
                                </svg>
                            )}
                            <input
                                type="file"
                                ref={fileInputRef}
                                className="hidden"
                                accept="image/*"
                                onChange={handleImageChange}
                            />
                        </motion.div>
                    </motion.div>

                    
                    <div className="space-y-4">
                        <div className="space-y-4 rounded-lg bg-gray-50 p-4">
                            <InputField
                                label="Ім'я"
                                name="pet_name"
                                value={petData.pet_name}
                                onChange={handleInputChange}
                            />
                            <div className="relative">
                                <label
                                    htmlFor="gender"
                                    className={`absolute left-1 top-2 z-10 origin-[0] transform bg-gray-50 px-2 text-sm text-gray-500 duration-300 ${
                                        petData.gender
                                            ? 'scale-75 -translate-y-4'
                                            : 'scale-100 -translate-y-1/2 top-1/2'
                                    } peer-focus:top-2 peer-focus:-translate-y-4 peer-focus:scale-75 peer-focus:px-2 peer-focus:text-blue-600`}
                                >
                                    Стать
                                </label>
                                <select
                                    id="gender"
                                    name="gender"
                                    value={petData.gender}
                                    onChange={handleInputChange}
                                    className="peer block w-full appearance-none rounded-lg border border-gray-300 bg-transparent px-2.5 pb-2.5 pt-4 text-sm text-gray-900 focus:border-blue-600 focus:outline-none focus:ring-0"
                                >
                                    <option value="">Оберіть стать</option>
                                    <option value="Ч">Ч (Чоловіча)</option>
                                    <option value="Ж">Ж (Жіноча)</option>
                                </select>
                            </div>
                            <InputField
                                label="Дата народження"
                                name="date_of_birth"
                                type="date"
                                value={petData.date_of_birth}
                                onChange={handleInputChange}
                            />
                        </div>

                        <div className="space-y-4 rounded-lg bg-gray-50 p-4">
                            <InputField
                                label="Порода"
                                name="breed"
                                value={petData.breed}
                                onChange={handleInputChange}
                            />
                            <InputField
                                label="Вид"
                                name="species"
                                value={petData.species}
                                onChange={handleInputChange}
                            />
                            <InputField
                                label="Масть (Колір)"
                                name="color"
                                value={petData.color}
                                onChange={handleInputChange}
                            />
                        </div>

                        {!Alley && (
                            <>
                                <div className="space-y-4 rounded-lg bg-gray-50 p-4">
                                    <InputField
                                        label="Місце розташування ідентифікатора"
                                        name="identifier_type"
                                        value={petData.identifier_type}
                                        onChange={handleInputChange}
                                    />
                                    <InputField
                                        label="Номер ідентифікатора (ном. чіпу)"
                                        name="identifier_number"
                                        value={petData.identifier_number}
                                        onChange={handleInputChange}
                                    />
                                    <InputField
                                        label="Дата чіпування"
                                        name="chip_date"
                                        type="date"
                                        value={petData.chip_date}
                                        onChange={handleInputChange}
                                    />
                                </div>

                                <div className="space-y-4 rounded-lg bg-gray-50 p-4">
                                    <InputField
                                        label="Номер паспорта власника"
                                        name="owner_passport_number"
                                        value={petData.owner_passport_number}
                                        onChange={handleInputChange}
                                    />
                                </div>
                            </>
                        )}

                        <motion.button
                            type="submit"
                            disabled={loading}
                            className="mt-6 w-full rounded-[5em] bg-black px-6 py-3 text-lg font-semibold text-white shadow-md transition-colors hover:bg-gray-800 disabled:bg-gray-400 cursor-pointer"
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.97 }}
                        >
                            {loading
                                ? pet
                                    ? 'Оновлення...'
                                    : 'Реєстрація...'
                                : pet
                                ? 'Оновити'
                                : 'Зареєструвати улюбленця'}
                        </motion.button>
                    </div>
                </form>
            </motion.div>
        </motion.div>
    );
}
