export const metadata = {
  title: 'Login Page',
  description: 'Halaman login',
};

export default async function LoginPageLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}