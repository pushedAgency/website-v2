import "./globals.css";

export const metadata = {
  title: "Facundo Apaza",
  description: "Curso de ecommerce",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={``}
      >
        {children}
      </body>
    </html>
  );
}
