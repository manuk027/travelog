import { createContext, useContext, useEffect } from 'react';

const ThemeContext = createContext();

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider = ({ children }) => {
    // Light theme only — always remove dark class
    useEffect(() => {
        document.documentElement.classList.remove('dark');
        localStorage.setItem('theme', 'light');
    }, []);

    return (
        <ThemeContext.Provider value={{ isDarkMode: false, toggleTheme: () => { } }}>
            {children}
        </ThemeContext.Provider>
    );
};
