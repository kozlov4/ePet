import { useEffect, useState } from 'react';
import ArrowFront from '../../assets/images/icons/ArrowFront';
import { BoneIcon } from '../../assets/images/icons/BoneIcon';

const Home = () => {
    // TODO: MERGE DUPLICATE CODE SOMEWHERE (CNAP/favorite-list.tsx, CNAP/organisations.tsx, CNAP/pet-registration.tsx, index.tsx)
    const [userName, setUserName] = useState('');

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const storedUserName = localStorage.getItem('user_name') || '';
            setUserName(storedUserName);
        }
    }, []);
    // to here
    return (
        <div className="flex flex-col h-[70%] max-w-full mx-auto">
            <div
                className="pt-12 pl-16 pr-9 pb-9 rounded-2xl flex justify-between  bg-cover"
                style={{ backgroundImage: "url('./HomeBackground.png')" }}
            >
                <div className="flex flex-col justify-between">
                    <h1 className="text-white text-6xl">єПрихисток</h1>
                    <p className="text-white text-xl">
                        Дайте шанс на дім — оберіть улюбленця через
                        «ЄПрихисток».
                    </p>
                </div>
                <BoneIcon />
            </div>
            <section className="relative mt-40 mx-16">
                <div className="flex flex-col gap-9 max-w-xl">
                    <h1 className="text-[#1E1E1E] text-6xl">
                        Завантажте<br></br>наш додаток
                    </h1>
                    <p className="text-[#3A3A3A] text-base">
                        Піклуйтесь про свого пухнастого друга зручніше, ніж
                        будь-коли.Зберігайте документи, переглядайте історію
                        щеплень, отримуйте нагадування про візити до ветеринара
                        та відкривайте нові можливості догляду — все в одному
                        місці Завантажте «єУлюбленець» і зробіть життя свого
                        улюбленця ще кращим{' '}
                    </p>
                    <img
                        src="./google-play.png"
                        alt=""
                        className="w-[186px] h-[61px]"
                    />
                </div>
                <img
                    src="./download-app.png"
                    alt=""
                    className="absolute right-0 -top-40"
                />
            </section>
            <section className="my-48">
                <h1 className="text-4xl text-black mb-8">
                    Питання та відповіді
                </h1>
                <div className="px-6 py-14 bg-[rgba(217,217,217,_0.27)] rounded-2xl">
                    <div className="flex justify-between w-full  py-4">
                        <p className="text-[13px] text-black">
                            Як додати нового улюбленця до застосунку?
                        </p>
                        <a href="#" className="w-5 h-5">
                            <ArrowFront />
                        </a>
                    </div>
                    <div className="flex justify-between w-full py-4">
                        <p className="text-[13px] text-black">
                            Додати нового улюбленця може лише співробітник ЦНАП.
                            Ви отримаєте паспорт тварини у застосунку після
                            внесення даних працівником.
                        </p>
                        <a href="#" className="w-5 h-5">
                            <ArrowFront />
                        </a>
                    </div>
                    <div className="flex justify-between w-full py-4">
                        <p className="text-[13px] text-black">
                            Чи можна редагувати дані про улюбленця?
                        </p>
                        <a href="#" className="w-5 h-5">
                            <ArrowFront />
                        </a>
                    </div>
                    <div className="flex justify-between w-full py-4">
                        <p className="text-[13px] text-black">
                            Де зберігаються документи мого улюбленця?
                        </p>
                        <a href="#" className="w-5 h-5">
                            <ArrowFront />
                        </a>
                    </div>
                    <div className="flex justify-between w-full  py-4">
                        <p className="text-[13px] text-black">
                            Як отримати витяг про щеплення або інші довідки?
                        </p>
                        <a href="#" className="w-5 h-5">
                            <ArrowFront />
                        </a>
                    </div>
                    <div className="flex justify-between w-full py-4">
                        <p className="text-[13px] text-black">
                            Що робити, якщо я загубив(ла) доступ до акаунта?
                        </p>
                        <a href="#" className="w-5 h-5">
                            <ArrowFront />
                        </a>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;
