export default function Layout({children,}: Readonly<{ children: React.ReactNode; }>) {
  return (
    <div className="mt-10 py-16 h-full mx-auto max-w-5xl p-6 lg:px-8">
      {children}
    </div>
  )
}