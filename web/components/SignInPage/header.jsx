import CatIcon from "./Images/catIcon";
import UkraineIcon from "./Images/ukraineIcon";

export function HeaderSignIn() {
  return (
    <div className="w-full h-[12%] flex justify-end ">
      <div className="flex w-[90%] h-full bg-[rgba(217,217,217,0.27)] backdrop-blur-[8.1px] shadow-[0_4px_21px_0_rgba(0,0,0,0.1)] border border-black rounded-b-[15px] justify-between items-center">
        <div className="flex gap-10 w-[40%]  h-full items-center">
          <div className="flex h-full  gap-4 items-center ml-[10%]">
            <div className="flex w-12 h-12 justify-center items-center bg-black rounded-lg">
              <CatIcon />
            </div>
            <div className="flex w-12 h-12 justify-center items-center border-[2.5px] border-black rounded-lg">
                <UkraineIcon/>
            </div>
          </div>
          <span className="text-black text-sm font-medium">Головна</span>
          <span className="text-black text-sm font-medium"> Питання та відповіді</span>
        </div>
        <button className="flex w-[14%] h-[50%] mr-[5%] bg-black rounded-3xl justify-center items-center ">
            <span className="text-white">Увійти до кабінету</span>
        </button>
      </div>
    </div>
  );
}
