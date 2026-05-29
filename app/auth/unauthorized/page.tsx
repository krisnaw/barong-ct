export default function UnauthorizedPage() {
  return (
    <div className="bg-background flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
      <div className="w-full max-w-sm">
        <div className="flex flex-col items-center gap-2 text-center">
          <div className="flex flex-col items-center gap-2 font-medium">
            <img
              alt="Barong Cycling Logo"
              src="/barong-no-bg.svg"
              className="h-24"
            />
            <span className="sr-only">Barong Cycling.</span>
          </div>
          <h1 className="text-xl font-bold">Unauthorized</h1>
          <p className="text-muted-foreground text-sm">
            You do not have permission to access this area.
          </p>
        </div>
      </div>
    </div>
  )
}
