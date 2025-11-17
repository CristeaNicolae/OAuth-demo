"use client";

import { useRouter } from "next/navigation";

export default function LoggedHome() {

    const router = useRouter();

    return(
        <div className="flex flex-col">
            Hello World
            <button 
            onClick={() => {
                router.back();
            }}
            className="w-fit border hover: cursor-pointer hover:bg-white hover:text-black transition p-3 rounded">Go Back</button>
        </div>
    );
}