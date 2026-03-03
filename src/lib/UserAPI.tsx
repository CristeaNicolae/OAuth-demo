import { APP_ROUTE } from "@/utils/constants";

export async function getUserDetails() {
    return fetch(`${APP_ROUTE}user`);
}