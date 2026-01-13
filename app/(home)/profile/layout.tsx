export default function Layout({
                                 children,
                               }: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="mt-10">
      <div className="mx-auto max-w-5xl">
        {children}
      </div>
    </div>
  )
}