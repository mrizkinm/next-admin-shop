export const metadata = {
  title: 'Login Page',
  description: 'Admin Login Page',
};

export default async function LoginPageLayout({ children }: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div>
      {children}
    </div>
  )
}