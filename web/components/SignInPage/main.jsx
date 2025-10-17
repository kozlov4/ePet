export function MainSignIn() {
  return (
    <div className="w-[50%] h-full flex bg-white">
      <div className="w-full h-[50%] mt-[25%] mx-[8%]">
        <h1 className="font-medium ml-[3%]  text-5xl mb-6">
          Увійти до кабінету
        </h1>

        <div className="w-full h-[70%]  flex flex-col justify-center items-center  p-4 rounded-xl">
          <input
            type="email"
            placeholder="Електронна адреса"
            className="w-full h-[30%] px-4 py-2 font-normal text-[20px] text-[#b3b3b3] border  border-[#e6e6e6] rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          <input
            type="password"
            placeholder="Пароль"
            className="w-full h-[30%] px-4 py-2 shadow-xl border border-[#e6e6e6] rounded-xl font-normal text-[20px] text-[#b3b3b3] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          <a
            href="http://localhost:3000/resetPassword"
            className="mt-[2%] ml-[70%] font-medium text-[15px] underline decoration-slate-600 text-[#606060] decoration-auto transition-all duration-300 ease-in-out hover:text-[#1e88e5] hover:decoration-[#1e88e5] hover:translate-x-[2px]"
          >
            Забули пароль?
          </a>
        </div>
        <button className="w-full h-[15%] mt-[5%] flex font-medium text-xl cursor-pointer justify-center items-center rounded-3xl bg-black text-white transition-all duration-300 ease-in-out hover:bg-[#1e88e5] hover:shadow-lg hover:scale-[1.03] active:scale-[0.98]">
          Увійти
        </button>
      </div>
    </div>
  );
}
