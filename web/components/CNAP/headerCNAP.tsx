import CatIcon from '../../assets/images/icons/CatIcon'
import UkraineArmsIcon from '../../assets/images/icons/UkraineArmsIcon'
import { motion } from 'framer-motion'
import Link from 'next/link'

export function HeaderCNAP(prop: { cnapid: string }) {
    return (
        <div className="w-full flex justify-end">
            <div className="flex w-full h-full bg-[rgba(217,217,217,0.27)] backdrop-blur-[8.1px] shadow-[0_4px_21px_0_rgba(0,0,0,0.1)] rounded-b-[15px] justify-between items-center py-4">
                {' '}
                <div className="flex gap-8 w-[100%] h-full items-center ">
                    <Link
                        className="flex h-full gap-4 items-center ml-[10%]"
                        href={'/CNAP/home'}
                    >
                        <div className="flex w-12 h-12 justify-center items-center bg-black rounded-lg">
                            <CatIcon />
                        </div>
                        <div className="flex w-12 h-12 justify-center items-center border-[2.5px] border-black rounded-lg">
                            <UkraineArmsIcon />
                        </div>
                    </Link>
                    <Link
                        href={'home'}
                        className="relative text-black text-sm font-medium transition-all duration-300 ease-in-out hover:text-[#1e88e5] after:content-[''] after:absolute after:left-0 after:bottom-[-2px] after:h-[2px] after:w-0 after:bg-[#1e88e5] after:transition-all after:duration-300 hover:after:w-full hover:-translate-y-[2px]"
                    >
                        Список улюбленців
                    </Link>
                    <Link
                        href={'organisations'}
                        className="relative text-black text-sm font-medium transition-all duration-300 ease-in-out hover:text-[#1e88e5] after:content-[''] after:absolute after:left-0 after:bottom-[-2px] after:h-[2px] after:w-0 after:bg-[#1e88e5] after:transition-all after:duration-300 hover:after:w-full hover:-translate-y-[2px]"
                    >
                        {' '}
                        Список організацій
                    </Link>
                </div>
                <div className="flex w-[100%] h-full justify-end items-center gap-4">
                    <span className="text-black">{prop.cnapid}</span>
                    <button className="px-4 py-2 mr-[5%] flex bg-black rounded-3xl cursor-pointer justify-center items-center text-white font-medium text-[15px] transition-all duration-300 ease-in-out hover:bg-[#1e88e5] hover:shadow-[0_0_20px_#1e88e580] hover:scale-[1.05] active:scale-[0.98] ">
                        {' '}
                        <span className="text-white">Меню</span>
                    </button>
                </div>
            </div>
        </div>
    )
}
