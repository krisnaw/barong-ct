import {getParticipantById} from "@/db/query/participant-query";

export default async function Page({params}: { params: Promise<{ id: number }> }) {
  const {id} = await params
  const participant = await getParticipantById(Number(id))
  if (!participant) return null

  return (
    <div className="flex min-h-svh flex-col items-center justify-center p-12">
      <div className="flex flex-col items-center gap-8 text-center">
        <p className="text-7xl font-bold tracking-tight">{participant.user.name}</p>
        <div className="flex gap-12 text-2xl text-muted-foreground">
          <div className="flex flex-col items-center gap-1">
            <span className="text-sm uppercase tracking-widest">Bib</span>
            <span className="text-5xl font-bold text-foreground">{participant.bibNumber}</span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <span className="text-sm uppercase tracking-widest">Jersey</span>
            <span className="text-5xl font-bold text-foreground uppercase">{participant.jerseySize}</span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <span className="text-sm uppercase tracking-widest">Category</span>
            <span className="text-5xl font-bold text-foreground">{participant.category?.name}</span>
          </div>
        </div>
      </div>
    </div>
  )
}