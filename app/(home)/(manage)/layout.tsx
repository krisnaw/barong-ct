export default function Layout({children,}: Readonly<{ children: React.ReactNode; }>) {
  return (
    <div className="mt-6 py-16 mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
      {children}
    </div>
  )
}