
import { getAuth } from "firebase/auth";
import { goto } from "$app/navigation";

export function AuthUserOnly() {
    const authInstance = getAuth();
    const currentUser = authInstance.currentUser;

    if (!currentUser) {
        goto("/login");
    }
}