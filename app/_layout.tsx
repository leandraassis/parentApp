import { Navigator } from "expo-router";
import { SessionProvider } from "./ctx";
import Slot = Navigator.Slot;
import { PaperProvider } from "react-native-paper";
import { useColorScheme } from "react-native";
import { darkTheme, lightTheme } from "../constants/Theme";
import { useStorageState } from "./useStorageState";

export default function RootLayout() {
  const themeType = useColorScheme();
  const [[isLoadingTheme, theme], setTheme] = useStorageState('theme');
  const themeJson = {
      'dark': darkTheme,
      'light': lightTheme
  };

  return (
    <PaperProvider theme={theme === "auto" || theme === null ? themeType === "dark" ? themeJson['dark'] : themeJson['light'] : themeJson[theme]}>
      <SessionProvider>
        <Slot />
      </SessionProvider>
    </PaperProvider>
  );
}
