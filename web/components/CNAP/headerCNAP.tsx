import CatIcon from "../../assets/images/icons/catIcon";
import UkraineArmsIcon from "../../assets/images/icons/UkraineArmsIcon";
import Link from 'next/link';

export function HeaderCNAP(prop: { cnapid: number }) {
    return (
        <div className="w-full flex justify-end">
            <div className="flex w-full h-full bg-[rgba(217,217,217,0.27)] backdrop-blur-[8.1px] shadow-[0_4px_21px_0_rgba(0,0,0,0.1)] rounded-b-[15px] justify-between items-center py-4"> {/* Added 'py-4' for padding */}

                <div className="flex gap-8 w-[100%] h-full items-center ">
                    <Link className="flex h-full gap-4 items-center ml-[10%]" href={"/CNAP/home"}>
                        <div className="flex w-12 h-12 justify-center items-center bg-black rounded-lg">
                            <CatIcon />
                        </div>
                        <div className="flex w-12 h-12 justify-center items-center border-[2.5px] border-black rounded-lg">
                            <UkraineArmsIcon />
                        </div>
                    </Link>
                    <Link href={"home"} className="text-black text-sm font-medium cursor-pointer">Список улюбленців</Link>
                    <Link href={"organisations"} className="text-black text-sm font-medium cursor-pointer"> Список організацій</Link>
                </div>

                <div className="flex w-[100%] h-full justify-end items-center gap-4">
                    <span className="text-black">ЦНАП {prop.cnapid}</span>
                    <button className="flex w-auto h-auto px-4 py-2 mr-[5%] bg-black rounded-3xl justify-center items-center cursor-pointer"> {/* Changed 'w' and 'h' to auto */}
                        <span className="text-white">Меню</span>
                    </button>
                </div>

            </div>
        </div>
    );
}