import { HeaderSignIn } from "../components/SignInPage/header";
import { MainSignIn } from "../components/SignInPage/main";

export default function SignIn() {
  return (
    <div
      className="bg-cover bg-center w-screen h-screen"
      style={{ backgroundImage: "url('/images/font.png')" }}
    >
      <HeaderSignIn />
      <MainSignIn/>
    </div>
  );
}
