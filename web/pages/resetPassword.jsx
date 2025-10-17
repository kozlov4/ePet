import { HeaderReset } from "../components/ResetPassword/headerReset";
import { MainReset } from "../components/ResetPassword/mainReset";

export default function SignIn() {
  return (
    <div
      className="bg-cover bg-center w-screen h-screen"
      style={{ backgroundImage: "url('/images/font.png')" }}
    >
      <HeaderReset />
      <MainReset />
    </div>
  );
}
