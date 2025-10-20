import { motion } from "framer-motion";
import CatIcon from "./Images/catIcon";
import UkraineIcon from "./Images/ukraineIcon";

export function HeaderReset() {
  return (
    <div className="w-full h-[12%] flex justify-end absolute">
      <motion.div
        className="flex w-full h-full bg-[rgba(217,217,217,0.27)] backdrop-blur-[8.1px] shadow-[0_4px_21px_0_rgba(0,0,0,0.1)] rounded-b-[15px] justify-between items-center"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        <motion.div
          className="flex gap-14 w-[40%] h-full items-center ml-[5%]"
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, delay: 0.3 }}
        >
          <motion.div className="flex h-full gap-4 items-center" 
            initial={{ opacity: 0, scale: 0.8 }} 
            animate={{ opacity: 1, scale: 1 }} 
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <div className="flex w-12 h-12 justify-center items-center bg-black rounded-lg">
              <CatIcon />
            </div>
            <div className="flex w-12 h-12 justify-center items-center border-[2.5px] border-black rounded-lg">
              <UkraineIcon />
            </div>
          </motion.div>

          <motion.a
            href="#"
            className="relative text-black text-sm font-medium transition-all duration-300 ease-in-out hover:text-[#1e88e5] after:content-[''] after:absolute after:left-0 after:bottom-[-2px] after:h-[2px] after:w-0 after:bg-[#1e88e5] after:transition-all after:duration-300 hover:after:w-full hover:-translate-y-[2px]"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            Головна
          </motion.a>

          <motion.a
            href="#"
            className="relative text-black text-sm font-medium transition-all duration-300 ease-in-out hover:text-[#1e88e5] after:content-[''] after:absolute after:left-0 after:bottom-[-2px] after:h-[2px] after:w-0 after:bg-[#1e88e5] after:transition-all after:duration-300 hover:after:w-full hover:-translate-y-[2px]"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.7 }}
          >
            Питання та відповіді
          </motion.a>
        </motion.div>

        <motion.button
          className="flex w-[14%] h-[50%] mr-[5%] bg-black rounded-3xl cursor-pointer justify-center items-center text-white font-medium text-[15px] transition-all duration-300 ease-in-out hover:bg-[#1e88e5] hover:shadow-[0_0_20px_#1e88e580] hover:scale-[1.05] active:scale-[0.98]"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          Увійти до кабінету
        </motion.button>
      </motion.div>
    </div>
  );
}
