import {getParticipantById} from "@/db/query/participant-query";

export default async function Page({params}: { params: Promise<{ id: number }> }) {
  const {id} = await params
  const participant = await getParticipantById(Number(id))
  if (!participant) return null
  return (
    <div>
      {participant.user.name}
    </div>
  )
}