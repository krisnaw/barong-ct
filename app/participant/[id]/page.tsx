import {getParticipantById} from "@/db/query/participant-query";

export default async function Page({params}: { params: Promise<{ id: number }> }) {
  const {id} = await params
  const participant = await getParticipantById(Number(id))
  if (!participant) return null

  return (
    <div className="flex min-h-svh flex-col items-center justify-center p-4 sm:p-12">
      <div className="flex w-full max-w-5xl flex-col items-center gap-6 text-center sm:gap-8">
        <p className="text-4xl font-bold tracking-tight sm:text-7xl">{participant.user.name}</p>
        <div className="flex w-full flex-col items-center justify-center gap-6 sm:flex-row sm:gap-12 sm:text-2xl text-muted-foreground">
          <div className="flex flex-col items-center gap-1">
            <span className="text-xs uppercase tracking-widest sm:text-sm">Bib</span>
            <span className="text-4xl font-bold text-foreground sm:text-5xl">{participant.bibNumber}</span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <span className="text-xs uppercase tracking-widest sm:text-sm">Jersey</span>
            <span className="text-4xl font-bold text-foreground sm:text-5xl capitalize">{participant.jerseySize}</span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <span className="text-xs uppercase tracking-widest sm:text-sm">Category</span>
            <span className="text-4xl font-bold text-foreground sm:text-5xl">{participant.category?.name}</span>
          </div>
        </div>
      </div>
    </div>
  )
}