import { plainAxiosInstance, securedAxiosInstance } from "./ApiService";

export async function getCurrentUser() {
  return plainAxiosInstance.get("/me");
}

export async function signIn(email, password) {
  return plainAxiosInstance.post("/signin", {
    email: email,
    password: password,
  });
}

export async function signOut() {
  return securedAxiosInstance.delete("/signin");
}
