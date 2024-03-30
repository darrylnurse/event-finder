import {useEffect, useState} from "react";

const ID = import.meta.env.VITE_CLIENT_ID;
const KEY = import.meta.env.VITE_CLIENT_SECRET;

function App() {

  const setDate = () => {
    let today = new Date;
    let tomorrow = today.getTime() + 86400000;
    setTomorrowDate(new Date(tomorrow).toISOString().slice(0,10));
    console.log(tomorrowDate);
  }

  useEffect(() => {
    setDate();
  }, []);

  const [eventList, setEventList] = useState(null);
  const [eventType, setEventType] = useState("");
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [searchInput, setSearchInput] = useState("");
  const [performer, setPerformer] = useState("Lebron James");
  const [tomorrowNumber, setTomorrowNumber] = useState(0);
  const [tomorrowDate, setTomorrowDate] = useState('1970-01-01');
  const [highestRated, setHighestRated] = useState({});

  const searchEvents = (searchValue) => {
    setSearchInput(searchValue);
    if (eventList && (searchValue !== "")) {
      const filteredData = eventList.events.filter((item) =>
          item.title.toLowerCase().includes(searchValue.toLowerCase())
      );
      setFilteredEvents(filteredData);
    } else setFilteredEvents(eventList.events);
  };

  const getRandElement = array => {
    const randomIndex = Math.floor(Math.random() * array.length);
    return array[randomIndex];
  }

  useEffect(() => {

    const baseApiUrl = `https://api.seatgeek.com/2/events?client_id=${ID}&client_secret=${KEY}`;
    const searchParam = searchInput ? `&q=${encodeURIComponent(searchInput)}` : '';
    const eventTypeParam = eventType ? `&type=${eventType}` : '';
    const finalUrl = `${baseApiUrl}${eventTypeParam}${searchParam}`;

    const fetchEvents = async () => {
      try {
        const response = await fetch(finalUrl);
        const data = await response.json();
        setEventList(data);
      } catch (error) {
        console.error("Failed to fetch events:", error);
      }
    };
    const fetchRandomPerformer = async () => {
      try {
        const response = await fetch(`https://api.seatgeek.com/2/performers?client_secret=${KEY}&client_id=${ID}&has_upcoming_events=true&per_page=30&page=1`);
        const data = await response.json();
        setPerformer(getRandElement(data.performers));
      } catch (error) {
        console.error("Failed to fetch performers: ", error);
      }
    }

    const fetchTomorrowNumber = async () => {
      try {
        const response = await fetch(`https://api.seatgeek.com/2/events?client_id=${ID}&datetime_utc=${tomorrowDate}`);
        const data = await response.json();
        setTomorrowNumber(data.meta.total);
      } catch (error) {
        console.error("Failed to fetch number: ", error);
      }
    }

    fetchEvents().catch(console.error);
    fetchRandomPerformer().catch(console.error);
    fetchTomorrowNumber().catch(console.error);

  }, [eventType, searchInput]);

  const handleEventTypeChange = (event) => {
    const newEventType = event.target.value;
    setEventType(newEventType);
  };

  useEffect(() => {
    const computeHighestScore = () => {
      let newHighestScore = -Infinity;
      let newHighestPerformerName = "";

      const eventsToCheck = searchInput && searchInput.length > 0 ? filteredEvents : eventList?.events;

      if (eventsToCheck) {
        eventsToCheck.forEach(event => {
          event.performers.forEach(performer => {
            if (performer.score > newHighestScore) {
              newHighestScore = performer.score;
              newHighestPerformerName = performer.name;
            }
          });
        });

        if (newHighestScore !== highestRated.highScore) {
          setHighestRated({
            highScore: newHighestScore,
            name: newHighestPerformerName,
          });
        }
      }
    };

    computeHighestScore();

  }, [filteredEvents, eventList, searchInput]);


  return (
      <div id={"page"}
           className={"grid grid-cols-4 bg-purple-900 text-white p-3 gap-3 h-screen"}>

        <div className={"overflow-hidden rounded-2xl bg-gray-400 bg-opacity-50"}><img className={"object-cover h-full object-center"} alt="leborn jame" src={"src/assets/justimberlake.gif"}/></div>

        <div className={"rounded-2xl bg-gray-400 bg-opacity-50 col-span-2 flex flex-col"}>
          <div className={"text-2xl h-1/6 flex justify-center items-center font-bold"}><h1>Event Finder</h1></div>

          <div className={"h-1/6 flex p-4 gap-4 justify-center items-center"}>

            <input
                type="text"
                placeholder="Search for an Event"
                className="w-1/2 p-7 rounded-2xl text-black"
                onChange={(e) => searchEvents(e.target.value)}
            />

            <select
                className={"p-7 w-1/2 rounded-2xl text-black"}
                onChange={handleEventTypeChange}
            >
              <option value={""}>Choose the Event Type.</option>
              <option value={"concert"}>Concert</option>
              <option value={"mls"}>Major League Soccer</option>
              <option value={"ncaa_basketball"}>NCAA Basketball</option>
              <option value={"ncaa_hockey"}>NCAA Hockey</option>
              <option value={"rodeo"}>Rodeo</option>
              <option value={"comedy"}>Comedy</option>

            </select>
          </div>

          {
            searchInput.length > 0
            ?
                <div className={"h-full"}>
                  <ul className={"h-full flex flex-col gap-2 p-2 justify-evenly"}>
                    <li className={"rounded-2xl grid-cols-4 grid gap-2"}>
                      <div className={"col-span-2 flex justify-center text-center items-center rounded-xl p-3"}>Event</div>
                      <div className={"flex justify-center items-center rounded-xl"}>Date</div>
                      <div className={"flex justify-center text-center p-2 items-center rounded-xl"}>Location</div>
                    </li>
                    {filteredEvents.map((event) =>
                        <li key={event.id}
                            className={"h-full rounded-2xl grid-cols-4 grid gap-2"}>
                          <div className={"col-span-2 flex justify-center text-center items-center rounded-xl p-3 bg-opacity-60 bg-gray-400"}>{event.title}</div>
                          <div className={"flex justify-center items-center rounded-xl bg-opacity-60 bg-gray-400"}>{new Date(event.datetime_utc).toDateString()}</div>
                          <div className={"flex justify-center text-center p-2 items-center rounded-xl bg-opacity-60 bg-gray-400"}>{event.venue.name}</div>
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
                    {eventList && eventList.events.map((event) =>
                        <li key={event.id}
                            className={"h-full rounded-2xl grid-cols-4 grid gap-2"}>
                          <div
                              className={"col-span-2 flex justify-center text-center bg-opacity-60 bg-gray-400 items-center rounded-xl p-3"}>{event.title}</div>
                          <div
                              className={"flex justify-center items-center rounded-xl bg-opacity-60 bg-gray-400"}>{new Date(event.datetime_utc).toDateString()}</div>
                          <div
                              className={"flex justify-center text-center p-2 items-center bg-opacity-60 bg-gray-400 rounded-xl"}>{event.venue.name}</div>
                        </li>
                    )}
                  </ul>
                </div>
          }

        </div>

        <div className={"grid grid-rows-3 gap-3"}>
          <div
              className={"order-2 bg-gray-400 bg-opacity-50 rounded-2xl flex items-center justify-center text-3xl font-bold"}>{tomorrowNumber || "No"} events
            tomorrow!
          </div>

          <div
              className={"order-1 bg-gray-400 bg-opacity-50 rounded-2xl flex gap-4 flex-col items-center justify-center"}>
            <h2 className={"font-bold text-xl"}>Upcoming Performers</h2>
            <img alt={"random performer"}
                 src={performer.image}
                 className={"rounded-2xl"}
            />
            <h2 className={"font-bold"}>{performer.name}</h2>
          </div>

          <div className={"order-3 bg-gray-400 bg-opacity-50 rounded-2xl flex flex-col gap-2 items-center justify-center"}>
            <div className={"font-bold text-xl"}><h1>Most Popular Performer</h1></div>
            <div className={"text-xl"}>{highestRated.name}</div>
            <div>Popularity Score: {highestRated.highScore}</div>
          </div>

        </div>

      </div>
  )
}

export default App
