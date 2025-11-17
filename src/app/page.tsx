"use client";

import Image from "next/image";
import { redirect, useRouter } from "next/navigation";

export default function Home() {

  const router = useRouter();

  const form_btn: string = "border-2 w-[60%] rounded-xl p-3 hover:cursor-pointer hover:bg-white hover:text-black transition";
  const form_label: string = "flex flex-row w-full box-border"

  const handleFormLogin = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Logged In");
    router.push("/home");
  }

  const handleGoogleLogin = () => {
    router.push("/api/auth/login/google");

  }

  return (
    <div className="flex flex-col font-sans items-center min-h-screen p-8 pb-20 gap-10 sm:p-20 justify-between">
      <header className="w-max text-5xl">
        OAuth Demo
      </header>
      <form className="flex flex-col border-3 rounded-xl p-5 text-3xl"
            onSubmit={handleFormLogin}>
        <div className="text-center mb-15 font-bold">
          Login
        </div>
        <div className="flex flex-col gap-5 mb-10 box-border w-[25rem]">
          <label className={form_label}>
            <div className="min-w-[35%] flex items-center">Email</div>
            <input type="text" name="email" className="border p-1 w-full flex-1" />
          </label>
          <label className={form_label}>
            <div className="w-[35%] flex items-center">Password</div>
            <input type="text" name="password" className="border p-1 w-full flex-1" />
          </label>
        </div>
        <div className="flex flex-col gap-5 items-center">
          <button type="submit" className={form_btn}>
            Login
          </button>
          <button onClick={() => {}} className={form_btn}>
            Register
          </button>
        </div>
        <div className="flex items-center flex-col">
          <div className="flex justify-center border-t-1 w-[70%] mt-10 text-base">Or Login with</div>
          <img 
          src="/icon_google.png"
          onClick={handleGoogleLogin} 
          alt="Google" 
          width={48} 
          height={48}
          className="hover:cursor-pointer mt-2"/>
        </div>
      </form>
      <footer>
        Icons by icons8.com
      </footer>
    </div>
  );
}
