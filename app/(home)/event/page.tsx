export default function EventPage() {
  return (
    <div className="max-w-2xl mx-auto my-20">

      <div>
        <ul role="list" className="space-y-6">
          {events.map(elem => (
            <li key={elem.id}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img className="rounded-lg" src="https://www.mainsepeda.com/uploads/event/30/FeaturedImage-1764067192.jpg" alt=""/>
              <div>
                <a href={`/event/${elem.id}`}>
                  <span className="absolute inset-0" />
                  <h2 className="text-lg font-semibold">{elem.title}</h2>
                </a>

              </div>
            </li>
          ))}
        </ul>
      </div>


    </div>
  )
}

const events = [
  {
    id: 1,
    title: 'Barong X Anniversary',
    invitation_only: true,
    feature_image: "https://www.mainsepeda.com/uploads/event/30/FeaturedImage-1764067192.jpg"
  },
  {
    id: 2,
    title: "Barong Melali 2026",
    invitation_only: false,
  }
]