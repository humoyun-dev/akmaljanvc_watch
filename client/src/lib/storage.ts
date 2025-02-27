interface UserData {
  phone: string;
  chatId: string;
}

const USER_DATA_KEY = "userData";

export function saveUserData(data: UserData): void {
  try {
    // Validate phone number format (assuming Uzbekistan format)
    const phoneRegex = /^998[0-9]{9}$/;
    if (!phoneRegex.test(data.phone)) {
      console.error("Invalid phone number format");
      return;
    }

    // Validate chatId (assuming it's a numeric string)
    if (!/^\d+$/.test(data.chatId)) {
      console.error("Invalid chat ID format");
      return;
    }

    localStorage.setItem(USER_DATA_KEY, JSON.stringify(data));
  } catch (error) {
    console.error("Error saving user data:", error);
  }
}

export function getUserData(): UserData | null {
  try {
    const data = localStorage.getItem(USER_DATA_KEY);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error("Error getting user data:", error);
    return null;
  }
}

export function clearUserData(): void {
  try {
    localStorage.removeItem(USER_DATA_KEY);
  } catch (error) {
    console.error("Error clearing user data:", error);
  }
}
