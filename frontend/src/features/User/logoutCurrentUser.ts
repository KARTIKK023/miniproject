import api from "@/lib/axios";


const logoutCurrentUser = async () => {
  try {
    await api.get("/auth/logout");
  } catch (error) {
    console.error("Logout failed:", error);
  }
};

export default logoutCurrentUser;