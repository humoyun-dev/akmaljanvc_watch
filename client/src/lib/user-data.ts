"use client";

import { useEffect, useState } from "react";
import { getUserData, saveUserData } from "@/lib/storage";

interface UserData {
  phone: string;
  chatId: string;
}

export function useUserData() {
  const [userData, setUserData] = useState<UserData | null>(null);

  useEffect(() => {
    // Load user data from localStorage on mount
    const data = getUserData();
    if (data) {
      setUserData(data);
    }
  }, []);

  const updateUserData = (newData: UserData) => {
    saveUserData(newData);
    setUserData(newData);
  };

  return {
    userData,
    updateUserData,
  };
}
