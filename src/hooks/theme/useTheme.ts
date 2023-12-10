import { useTheme as useNextTheme } from 'next-themes';
export default function useTheme() {
  const { setTheme } = useNextTheme();
  return {
    setTheme,
  };
}
