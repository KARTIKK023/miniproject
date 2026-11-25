'use client'

import  {useRouter} from "next/navigation";
import { useState, useEffect } from "react";
import { useAppSelector, useAppDispatch } from "@/lib/Redux.hooks";
import getCurrentUser from "@/features/User/getCurrentUser";
import { setUserData } from "@/redux/userSlice";

export default function Dashboard() {
  const router = useRouter()
  const dispatch = useAppDispatch();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const userData = useAppSelector(
    (state: { user: { userData: { name?: string; email?: string } | null } }) =>
      state.user.userData,
  );

  useEffect(() => {
    // Skip fetch if Redux already has the data (optional, depends on your caching strategy)
    if (userData) {
      setIsLoading(false);
      return;
    }

    const getUser = async () => {
      try {
        const data = await getCurrentUser();
        if (data) {
          dispatch(setUserData(data));
        } else {
          router.push("/login");
        }
      } catch (err) {
        console.error("Failed to fetch user:", err);
        setError("Failed to load user data. Please try logging in again.");
        router.push("/login");
      } finally {
        setIsLoading(false);
      }
    };
    getUser();

    // const getChatHistory = async () => {
    //   const data = await getConversations();
    //   dispatch(setConversations(data));
    // };
    // getChatHistory();
  }, [dispatch,router, userData]);

  if (isLoading) {
    return (
      <div className="flex animate-pulse flex-col gap-4 p-8">
        <div className="h-6 w-48 rounded bg-muted"></div>
        <div className="h-4 w-64 rounded bg-muted"></div>
      </div>
    );
  }

  if (error || !userData) {
    return null; // Prevent rendering sensitive UI entirely
  }

  return (
    <>
      <div className="flex items-center justify-center">
        this is dashboard for {userData.name} {userData.email}
      </div>
    </>
  );
}
