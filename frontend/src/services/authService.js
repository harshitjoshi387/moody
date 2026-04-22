import axios from "axios"

const api = axios.create({
    baseURL:"http://localhost:3000",
    withCredentials:true
})

export async function register({email, password,username }){
    const response = await api.post("/api/auth",{
        email,password,username
    })
    return response.data
}


export async function login({ email, username, password }) {
    const response = await api.post("/api/auth/login", {
        email,
        username,
        password
    });
    return response.data;
}

export async function logout() {
    const response = await api.post("/api/auth/logout");
    return response.data;
}

export async function getCurrentUser() {
    const response = await api.get("/api/auth/me");
    return response.data;
}

// Optional: Refresh token if your backend supports it
export async function refreshToken() {
    const response = await api.post("/api/auth/refresh");
    return response.data;
}