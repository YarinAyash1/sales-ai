'use client';

import {ThemeProvider as NextThemesProvider} from 'next-themes';
import type {ThemeProviderProps} from 'next-themes/dist/types';
import {DirectionProvider} from "@radix-ui/react-direction";

export function ThemeProvider({children, ...props}: ThemeProviderProps) {
    return (
        <NextThemesProvider {...props}>
            <DirectionProvider dir="rtl">
                {children}
            </DirectionProvider>
        </NextThemesProvider>
    );
}
