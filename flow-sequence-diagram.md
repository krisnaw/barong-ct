## Sequence Diagrams

Document the flow of interactions between different parts of your system.

**Text-based Sequence Example:**

```
# Flight Booking Sequence

UI -> flightSearch: searchFlights(criteria)
flightSearch -> UI: show flight options

UI -> hotelSearch: searchHotels(location, dates)
hotelSearch -> UI: show hotel options

UI -> api: createBooking(flight, hotel)
api -> db: save booking
db -> api: booking saved
api -> UI: show confirmation
```