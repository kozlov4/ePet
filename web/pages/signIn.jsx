import { HeaderMain } from "../components/Base/header";
import { MainSignIn } from "../components/SignInPage/main";

export default function SignIn() {
  return (
    <div
      className="bg-cover bg-center w-screen h-screen"
      style={{ backgroundImage: "url('./SignInBackground.png')" }}
    >
      
      <HeaderMain />
      <MainSignIn/>
    </div>
  );
}
