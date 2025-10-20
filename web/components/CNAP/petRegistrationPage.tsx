// app/components/PetRegistrationPage.tsx
'use client';

import React, { useState, useRef } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation'; // For back navigation

export default function PetRegistrationPage() {
    const router = useRouter();
    const fileInputRef = useRef<HTMLInputElement>(null);

    // State for form fields (initialize with empty strings or appropriate defaults)
    const [petData, setPetData] = useState({
        name: '',       // Ім'я
        gender: '',     // Стать
        breed: '',      // Порода
        type: '',       // Вид
        coat: '',       // Масть (Assuming "Масть" for "Масть")
        chipLocation: '', // Місцезнаходження чіпу
        chipDate: '',   // Дата чіпування
        chipNumber: '', // Номер чіпу
        owner: '',      // Власник
        issuingAuthority: '', // Орган що видав
    });

    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const petId = 'UA AA 658199'; // This would typically come from a dynamic route or API

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setPetData((prevData) => ({ ...prevData, [name]: value }));
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        } else {
            setImagePreview(null);
        }
    };

    const handleImagePlaceholderClick = () => {
        fileInputRef.current?.click();
    };

    const handleCopyId = () => {
        navigator.clipboard.writeText(petId);
        alert('Pet ID copied to clipboard!');
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log('Registering pet:', petData);
        console.log('Image:', imagePreview ? 'Image selected' : 'No image');
        alert('Pet registration data logged to console!');
        // In a real app, you'd send this data to your API
    };

    return (
        <div className="flex min-h-screen justify-center bg-gray-50 p-4 sm:p-8">
            <div className="w-full max-w-4xl rounded-xl bg-white p-6 shadow-lg sm:p-8 lg:p-10">
                {/* Top Navigation */}
                <div className="mb-8 flex items-center">
                    <button
                        onClick={() => router.back()} // Go back to the previous page
                        className="mr-4 rounded-full bg-gray-200 p-2 hover:bg-gray-300"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-6 w-6 text-gray-700"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth="2"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                    </button>
                    <h1 className="text-xl font-semibold text-gray-800">Реєстрація домашнього улюбленця</h1>
                </div>

                {/* Pet ID */}
                <div className="mb-8 flex items-center">
                    <h2 className="text-2xl font-bold text-gray-900">{petId}</h2>
                    <button
                        onClick={handleCopyId}
                        className="ml-2 p-1 text-gray-500 hover:text-gray-800"
                        aria-label="Copy Pet ID"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth="2"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2.586m-4.414-4.414a1 1 0 01-.293-.707V8.586a1 1 0 01.293-.707l4.414-4.414a1 1 0 01.707-.293H15"
                            />
                        </svg>
                    </button>
                </div>

                {/* Form Layout */}
                <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-8 md:grid-cols-2">
                    {/* Left Column: Image Upload */}
                    <div className="flex flex-col items-center">
                        <div
                            className="relative flex h-64 w-64 cursor-pointer items-center justify-center rounded-xl border-2 border-dashed border-gray-300 bg-gray-100 hover:bg-gray-200"
                            onClick={handleImagePlaceholderClick}
                        >
                            {imagePreview ? (
                                <Image src={imagePreview} alt="Pet Preview" layout="fill" objectFit="cover" className="rounded-xl" />
                            ) : (
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-16 w-16 text-gray-400"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                </svg>
                            )}
                            <input
                                type="file"
                                ref={fileInputRef}
                                className="hidden"
                                accept="image/*"
                                onChange={handleImageChange}
                            />
                        </div>
                    </div>

                    {/* Right Column: Form Fields */}
                    <div className="space-y-4">
                        {/* Group 1: Name, Gender, Breed, Type, Coat */}
                        <div className="space-y-4 rounded-lg bg-gray-50 p-4">
                            <InputField label="Ім'я" name="name" value={petData.name} onChange={handleInputChange} />
                            <InputField label="Стать" name="gender" value={petData.gender} onChange={handleInputChange} />
                            <InputField label="Порода" name="breed" value={petData.breed} onChange={handleInputChange} />
                            <InputField label="Вид" name="type" value={petData.type} onChange={handleInputChange} />
                            <InputField label="Масть" name="coat" value={petData.coat} onChange={handleInputChange} /> {/* Assuming "Масть" for coat */}
                        </div>

                        {/* Group 2: Chip Details */}
                        <div className="space-y-4 rounded-lg bg-gray-50 p-4">
                            <InputField label="Місцезнаходження чіпу" name="chipLocation" value={petData.chipLocation} onChange={handleInputChange} />
                            <InputField label="Дата чіпування" name="chipDate" type="date" value={petData.chipDate} onChange={handleInputChange} />
                            <InputField label="Номер чіпу" name="chipNumber" value={petData.chipNumber} onChange={handleInputChange} />
                        </div>

                        {/* Group 3: Owner Details */}
                        <div className="space-y-4 rounded-lg bg-gray-50 p-4">
                            <InputField label="Власник" name="owner" value={petData.owner} onChange={handleInputChange} />
                            <InputField label="Орган що видав" name="issuingAuthority" value={petData.issuingAuthority} onChange={handleInputChange} />
                        </div>

                        {/* Register Button */}
                        <button
                            type="submit"
                            className="mt-6 w-full rounded-xl bg-black px-6 py-3 text-lg font-semibold text-white shadow-md transition-colors hover:bg-gray-800"
                        >
                            Зареєструвати улюбленця
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

// Reusable Input Field Component
interface InputFieldProps {
    label: string;
    name: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    type?: string; // Optional type prop for input (e.g., 'date', 'text')
}

const InputField: React.FC<InputFieldProps> = ({ label, name, value, onChange, type = 'text' }) => (
    <div className="relative">
        <input
            type={type}
            id={name}
            name={name}
            value={value}
            onChange={onChange}
            className="peer block w-full appearance-none rounded-lg border border-gray-300 bg-transparent px-2.5 pb-2.5 pt-4 text-sm text-gray-900 focus:border-blue-600 focus:outline-none focus:ring-0"
            placeholder=" " // Important for the floating label effect
        />
        <label
            htmlFor={name}
            className="absolute left-1 top-2 z-10 origin-[0] -translate-y-4 scale-75 transform bg-gray-50 px-2 text-sm text-gray-500 duration-300 peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:scale-100 peer-focus:top-2 peer-focus:-translate-y-4 peer-focus:scale-75 peer-focus:px-2 peer-focus:text-blue-600 rtl:peer-focus:left-auto rtl:peer-focus:translate-x-full"
        >
            {label}
        </label>
    </div>
);