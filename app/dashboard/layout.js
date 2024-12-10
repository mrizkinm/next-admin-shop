export const metadata = {
  title: 'Dashboard',
  description: 'Halaman dashboard',
};

export default async function DashboardLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}