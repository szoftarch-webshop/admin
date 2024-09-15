export const login = async (email: string, password: string, rememberMe: boolean): Promise<Response> => {
    const loginApi = "https://localhost:44315";
    const cookiesUrl = rememberMe ? "/login?useCookies=true" : "/login?useSessionCookies=true";

    const response = await fetch(loginApi + cookiesUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
        credentials: 'include',
    });

    return response;
};

export const logout = async (): Promise<void> => {
    const logoutApi = "https://localhost:44315/logout";
  
    await fetch(logoutApi, {
      method: 'POST',
      credentials: 'include',
    });
  };
  

export const checkAuthorization = async (): Promise<Response> => {
    const authApi = "https://localhost:44315/pingauth";
    const response = await fetch(authApi, {
        method: "GET",
        credentials: "include",
    });

    return response;
};
