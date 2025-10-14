export function MainSignIn() {
  return (
    <div className="w-full h-[70%]">
      <h1 className="mt-[6%] font-medium text-6xl ml-[5%]">
        Увійти до кабінету
      </h1>
      <div className="flex mt-[5%] w-full h-[60%] justify-center">
        <div className="flex flex-col h-full w-[35%]  p-4">
          <input
            type="email"
            id="email"
            name="email"
            placeholder="Електронна адреса"
            className="px-4 py-2 border-b-[1px] text-[#b3b3b3] border-b-[#e6e6e6] bg-white h-[35%] text-xl font-normal rounded-t-lg drop-shadow-2xl"
          />
          <input
            type="password"
            id="password"
            name="password"
            placeholder="Пароль"
            className="px-4 py-2 text-[#b3b3b3] bg-white h-[35%] text-xl font-normal rounded-b-lg drop-shadow-2xl"
          />
          <div className="flex justify-end mt-[2%]">
            <span className="mr-[5%] font-medium text-[15px] underline decoration-skip-ink-none text-[#606060]">Забули пароль?</span>
          </div>
          <button className="w-full h-[30%] mt-[10%] rounded-4xl font-medium text-[20px] bg-black text-white">
                Увійти
          </button>
        </div>
      </div>
    </div>
  );
}
