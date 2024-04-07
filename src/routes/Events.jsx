
// eslint-disable-next-line react/prop-types
import {Link} from "react-router-dom";

// eslint-disable-next-line react/prop-types
export default function Events({searchInput, filteredEvents, eventList}){

  return (
      // eslint-disable-next-line react/prop-types
    searchInput.length > 0
        ?
        <div className={"h-full"}>
          <ul className={"h-full flex flex-col gap-2 p-2 justify-evenly"}>
            <li className={"rounded-2xl grid-cols-4 grid gap-2"}>
              <div className={"col-span-2 flex justify-center text-center items-center rounded-xl p-3"}>Event</div>
              <div className={"flex justify-center items-center rounded-xl"}>Date</div>
              <div className={"flex justify-center text-center p-2 items-center rounded-xl"}>Location</div>
            </li>
            {/* eslint-disable-next-line react/prop-types */}
            {filteredEvents.map((event) =>
                <li key={event.id}
                    className={"h-full rounded-2xl grid-cols-4 grid gap-2"}>
                  <div className={"col-span-2 flex justify-center text-center hover:scale-[101%] active:scale-[99%] transition-transform select-none cursor-pointer items-center rounded-xl p-3 bg-opacity-60 bg-gray-400"}>
                    <Link to={`/event/${event.id}`}>
                      {event.title}
                    </Link>
                  </div>
                  <div
                      className={"flex justify-center items-center rounded-xl bg-opacity-60 bg-gray-400"}>{new Date(event.datetime_utc).toDateString()}</div>
                  <div
                      className={"flex justify-center text-center p-2 items-center rounded-xl bg-opacity-60 bg-gray-400"}>{event.venue.name}</div>
                </li>
            )}
          </ul>
        </div>
        :
        <div className={"h-full"}>
          <ul className={"h-full flex flex-col gap-2 p-2 justify-evenly"}>
            <li className={"rounded-2xl grid-cols-4 grid gap-2"}>
              <div className={"col-span-2 flex justify-center text-center items-center rounded-xl p-3"}>Event</div>
              <div className={"flex justify-center items-center rounded-xl"}>Date</div>
              <div className={"flex justify-center text-center p-2 items-center rounded-xl"}>Location</div>
            </li>
            {/* eslint-disable-next-line react/prop-types */}
            {eventList && eventList.events.map((event) =>
                <li key={event.id}
                    className={"h-full rounded-2xl grid-cols-4 grid gap-2"}>
                  <div
                      className={"col-span-2 flex justify-center text-center hover:scale-[101%] active:scale-[99%] transition-transform select-none cursor-pointer bg-opacity-60 bg-gray-400 items-center rounded-xl p-3"}>
                    <Link to={`/event/${event.id}`}>
                      {event.title}
                    </Link>
                  </div>
                  <div
                      className={"flex justify-center items-center rounded-xl bg-opacity-60 bg-gray-400"}>{new Date(event.datetime_utc).toDateString()}</div>
                  <div
                      className={"flex justify-center text-center p-2 items-center bg-opacity-60 bg-gray-400 rounded-xl"}>{event.venue.name}</div>
                </li>
            )}
          </ul>
        </div>
  )
}