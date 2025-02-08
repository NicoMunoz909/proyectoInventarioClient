import { config } from "./apiClient";
const URL = config.url;

const authService = {
  
  // async register(user) {
  //   try {
  //     const response = await fetch(`${URL}/auth/register`, {
  //       method: "POST",
  //       headers: { 'Content-Type': 'application/json' },
  //       body: JSON.stringify(user)
  //     })
  //     return response.json();
  //   } catch (error) {
  //     return error
  //   }
  // },

  async login(credentials) {
    try {
      const response = await fetch(`${URL}/auth/login`, {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
        credentials: 'include'
      })
      const data = await response.json();
      localStorage.setItem("AppInventarioToken", data.data);
      return data
    } catch (error) {
      return error
    }
  },
};

export default authService