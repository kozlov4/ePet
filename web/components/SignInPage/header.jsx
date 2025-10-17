import CatIcon from "./Images/catIcon";
import UkraineIcon from "./Images/ukraineIcon";

export function HeaderSignIn() {
  return (
    <div className="w-full h-[12%] flex justify-end absolute">
      <div className="flex w-full h-full bg-[rgba(217,217,217,0.27)] backdrop-blur-[8.1px] shadow-[0_4px_21px_0_rgba(0,0,0,0.1)]  rounded-b-[15px] justify-between items-center">
        <div className="flex gap-14 w-[40%]  h-full items-center">
          <div className="flex h-full  gap-4 items-center ml-[10%]">
            <div className="flex w-12 h-12 justify-center items-center bg-black rounded-lg">
              <CatIcon />
            </div>
            <div className="flex w-12 h-12 justify-center items-center border-[2.5px] border-black rounded-lg">
              <UkraineIcon />
            </div>
          </div>
          <a
            href="#"
            className="relative text-black text-sm font-medium transition-all duration-300 ease-in-out hover:text-[#1e88e5] after:content-[''] after:absolute after:left-0 after:bottom-[-2px] after:h-[2px] after:w-0 after:bg-[#1e88e5] after:transition-all after:duration-300 hover:after:w-full hover:-translate-y-[2px]"
          >
            Головна
          </a>
          <a
            href="#"
            className="relative text-black text-sm font-medium transition-all duration-300 ease-in-out hover:text-[#1e88e5] after:content-[''] after:absolute after:left-0 after:bottom-[-2px] after:h-[2px] after:w-0 after:bg-[#1e88e5] after:transition-all after:duration-300 hover:after:w-full hover:-translate-y-[2px]"
          >
            Питання та відповіді
          </a>
        </div>
        <button className="flex w-[14%] h-[50%] mr-[5%] bg-black rounded-3xl justify-center items-center text-white font-medium text-[15px] transition-all duration-300 ease-in-out hover:bg-[#1e88e5] hover:shadow-[0_0_20px_#1e88e580] hover:scale-[1.05] active:scale-[0.98]">
          Увійти до кабінету
        </button>
      </div>
    </div>
  );
}
