import {useParams} from "react-router-dom";
import {useEffect, useState} from "react";

const ID = import.meta.env.VITE_CLIENT_ID;
const KEY = import.meta.env.VITE_CLIENT_SECRET;

const EventDetails = () => {

  let params = useParams();

  const [event, setEvent] = useState(null);


  useEffect(() => {
    const getEventDetail = async () => {
      const response = await fetch(
          `https://api.seatgeek.com/2/events?client_secret=${KEY}&client_id=${ID}&id=${params.id}`
      );
      const fetchedEvent = await response.json();
      console.log(fetchedEvent.events[0]);
      setEvent(fetchedEvent.events[0]);
    }
    getEventDetail().catch(console.error);
  }, [params.id]);

  return (
      event &&
      <div className={"h-full bg-opacity-50 flex justify-center items-center text-sm p-2 text-white rounded-2xl bg-gray-400"}>
        <div className={"w-full select-none flex gap-y-3 text-lg flex-col justify-center items-center p-4 pt-6"}>

          <img
              alt={"performer image"}
              src={event.performers[0].image}
              className={"rounded-2xl"}
          />
          <br/>
          <div>{event.title}</div>
          <div>{event.performers[0].name}</div>

          <div className={"flex w-full justify-center gap-4"}>
            <div>{event.venue.name}</div>
            <div>{event.venue.address}</div>
            <div>{event.venue.display_location}</div>
          </div>

          <div>
            Date: {new Date(event.datetime_utc).toDateString()}
            {" "}
            {new Date(event.datetime_utc).getHours() % 12}
            :
            {new Date(event.datetime_utc).getMinutes().toString().length >= 2 ? new Date(event.datetime_utc).getMinutes() : '0' + new Date(event.datetime_utc).getMinutes()}
            {new Date(event.datetime_utc).getHours() > 11 ? "pm" : "am"}
          </div>

          <div>Price: ${event.stats.average_price}</div>

          <div><a
              href={event.performers[0].url}
              target={"_blank"}
              style={{textDecoration: "underline"}}
          >Tickets</a></div>

        </div>

      </div>
  );
};

export default EventDetails;