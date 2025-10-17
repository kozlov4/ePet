export function MainReset() {
  return (
    <div className="w-[50%] h-full flex bg-white">
      <div className="w-full h-[50%] mt-[25%] mx-[8%]">
        <h1 className="font-medium ml-[3%] text-5xl ">
          Відновлення паролю
        </h1>

        <div className="w-full h-[70%]  flex flex-col justify-center items-center  p-4 rounded-xl">
          <input
            type="email"
            placeholder="Електронна адреса"
            className="w-full h-[30%] px-4 py-2 font-normal text-[20px] text-[#b3b3b3] border  border-[#e6e6e6] rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <span className="flex justify-center font- text-[15px] text-[#424242]">Новий пароль буде надіслано на вказану електронну адресу</span>
        <button className="w-full h-[15%] mt-[1%] flex font-medium text-xl justify-center items-center rounded-4xl bg-black text-white">Увійти</button>
      </div>
    </div>
  );
}

