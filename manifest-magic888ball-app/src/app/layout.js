import { Bowlby_One_SC, VT323 } from 'next/font/google';
import './styles/globals.css';

const bowlbyOneSC = Bowlby_One_SC({
  weight: '400',
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-bowlby',
});

const vt323 = VT323({
  weight: '400',
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-vt323',
});

export const metadata = {
  title: 'Magic 888 Ball',
  description: 'Get your sign from the universe',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${bowlbyOneSC.variable} ${vt323.variable}`}>
      <body className={`${bowlbyOneSC.className} ${vt323.className}`}>
        {children}
      </body>
    </html>
  );
}