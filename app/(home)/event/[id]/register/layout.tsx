export default async function RegisterLayout({children}: Readonly<{ children: React.ReactNode; }>) {
  return (
    <div className="mx-auto max-w-3xl px-4 md:px-6 lg:px-8 py-28">
      {children}
    </div>
  )
}