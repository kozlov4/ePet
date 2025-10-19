import Image from 'next/image';
import CatIcon from "../../assets/icons/catIcon";
import UkraineIcon from "../../assets/icons/ukraineIcon";


export function HeaderCNAP(prop: { cnapid: number }) {
    return (
        <div className="w-full h-[8%] flex justify-end absolute">
            <div className="flex w-full h-full bg-[rgba(217,217,217,0.27)] backdrop-blur-[8.1px] shadow-[0_4px_21px_0_rgba(0,0,0,0.1)] rounded-b-[15px] justify-between items-center">
                <div className="flex gap-8 w-[100%]  h-full items-center ">
                    <div className="flex h-full gap-4 items-center ml-[10%]">
                        <div className="flex w-12 h-12 justify-center items-center bg-black rounded-lg">
                            <CatIcon />
                        </div>
                        <div className="flex w-12 h-12 justify-center items-center border-[2.5px] border-black rounded-lg">
                            <UkraineIcon />
                        </div>
                    </div>
                    <div className="text-black text-sm font-medium cursor-pointer">Список улюбленців</div>
                    <div className="text-black text-sm font-medium cursor-pointer"> Список організацій</div>
                </div>

                <div className="flex w-[100%] h-full justify-end items-center gap-4">
                    <span className="text-black">ЦНАП {prop.cnapid}</span>
                    <button className="flex w-[14%] h-[40%] mr-[5%] bg-black rounded-3xl justify-center items-center cursor-pointer">
                        <span className="text-white">Меню</span>
                    </button>
                </div>

            </div>
        </div>
    );
}