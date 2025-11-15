import { PetPassport } from "../../../components/CNAP/PetPassport";

export default function PetPasssport(){
   return(
        <PetPassport
        actionButton={
                <button className="
                    px-4 py-2 w-[45%] 
                    bg-black text-white font-medium text-base 
                    rounded-3xl border border-transparent cursor-pointer
                    hover:bg-white hover:text-black hover:border-black
                    transition
                ">
                    Видалити
                </button>
            }
        />
    );
}