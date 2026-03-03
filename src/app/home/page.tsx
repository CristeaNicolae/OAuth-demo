"use client";

import { getUserDetails } from "@/lib/UserAPI";
import { UserLocalSessionData } from "@/types/auth";
import { local_user_data_name } from "@/utils/constants";
import { error } from "console";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function LoggedHome() {

    const [rawUserData, setRawUserData] = useState<string>("");
    const [userLocalData, setUserLocalData] = useState<UserLocalSessionData>();

    useEffect(() => {
        setRawUserData(localStorage.getItem(local_user_data_name) ?? "");
        if(!rawUserData) {
            getUserDetails()
            .then( async(res) => {
                if(!res.ok) throw new Error("Failed to fetch user");
                const data = await res.json();
                setUserLocalData(data.user);
                localStorage.setItem(local_user_data_name, JSON.stringify(data.user));
            })
            .catch(error => {
                console.error(error);
            })
        }
        else{
            setUserLocalData(JSON.parse(rawUserData));
        }
    }, []);

    const logOut = () => {
        localStorage.removeItem(local_user_data_name);
        
        router.push('/');
    }
    
    const router = useRouter();

    return(
        <div className="flex flex-col h-full justify-center items-center">
            <p>
                Salut boss
            </p>
            { userLocalData && (
                <>
                    <div>
                        <img src={userLocalData.picture_link} alt="Profile picture">
                        </img>
                    </div>

                    <div>
                        {userLocalData.family_name}
                        {userLocalData.given_name}
                    </div>
                </>
            )}

            <button
                onClick={logOut}
                className="w-fit border hover: cursor-pointer hover:bg-white hover:text-black transition p-3 rounded">Sign Out
            </button>
        </div>
    );
}