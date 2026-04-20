import './globals.css';

export const metadata = {
  title: 'Sparkline Auto Detailing',
  description: 'Professional auto detailing at your doorstep or our center. Premium products, trained specialists, guaranteed results.',
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
