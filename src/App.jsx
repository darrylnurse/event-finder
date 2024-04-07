import {useEffect, useState} from "react";
import { Bar } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);
import Events from "./routes/Events.jsx";


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
      let associatedEventTitle = ""; // Simplified to only store the event title

      const eventsToCheck = searchInput && searchInput.length > 0 ? filteredEvents : eventList?.events;

      if (eventsToCheck) {
        eventsToCheck.forEach(event => {
          event.performers.forEach(performer => {
            if (performer.score > newHighestScore) {
              newHighestScore = performer.score;
              newHighestPerformerName = performer.name;
              associatedEventTitle = event.short_title; // Update to store only the event title
            }
          });
        });

        if (newHighestScore !== highestRated.highScore) {
          setHighestRated({
            highScore: newHighestScore,
            name: newHighestPerformerName,
            eventTitle: associatedEventTitle // Store the event title directly
          });
        }
      }
    };

    computeHighestScore();

  }, [filteredEvents, eventList, searchInput]);

  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [{
      label: 'Event Price',
      data: [],
      backgroundColor: '#C971FF',
      borderColor: '#E2B2FF',
      borderWidth: 2,
    }],
  });

  useEffect(() => {
    if (eventList && eventList.events) {
      const processedLabels = eventList.events.map(event =>
          event.short_title.length > 10 ? `${event.short_title.slice(0, 15)}...` : event.short_title
      );
      const eventPrices = eventList.events.map(event => event.stats.lowest_price || 0);

      setChartData({
        labels: processedLabels,
        datasets: [{
          ...chartData.datasets[0],
          data: eventPrices,
        }]
      });
    }
  }, [eventList]);

  return (
      <div id={"page"}
           className={"grid grid-cols-4 text-white gap-3"}>

        <div className={"overflow-hidden h-screen flex flex-col items-center rounded-2xl bg-gray-400 bg-opacity-50"}>
          <div className="p-10 w-full h-1/4" style={{width: '100%', height: '75%'}}>
            <Bar data={chartData} options={{
              maintainAspectRatio: false,
              indexAxis: 'y',
              plugins : {
                legend : {
                  labels: {
                    color: 'white',
                  }
                },
                title : {
                  text: "Event Prices in Dollars",
                  display: true,
                  color: 'white',
                  font: {
                    size: 20
                  },
                },
              },
              scales: {
                x : {
                  ticks: {
                    color: 'white',
                  }
                },
                y: {
                  ticks:{
                    color: 'white',
                  },
                  beginAtZero: true
                }
              }
            }} />
          </div>
          <div className={"h-1/6"}>
            <img
                className={"h-full"}
                alt={"justimber"}
                src={"/src/assets/justimberlake.gif"}
            />
          </div>
        </div>

        <div className={"rounded-2xl overflow-hidden bg-gray-400 bg-opacity-50 col-span-2 flex flex-col"}>
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

          <div className={"overflow-scroll p-2"}>
            {/*<Outlet/>*/}
            <Events searchInput={searchInput} eventList={eventList} filteredEvents={filteredEvents}/>
          </div>

        </div>

        <div className={"select-none grid grid-rows-3 gap-3"}>
          <div
              className={"p-4 text-center order-2 bg-gray-400 bg-opacity-50 rounded-2xl flex items-center justify-center text-3xl font-bold"}>{tomorrowNumber || "No"} events
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

          <div
              className={"order-3 bg-gray-400 bg-opacity-50 rounded-2xl flex flex-col gap-2 items-center justify-center"}>
            <div className={"font-bold text-xl"}><h1>Most Popular Performer</h1></div>
            <div className={"text-3xl p-3"}>{highestRated.name}</div>
            {highestRated.eventTitle && ( // Conditional rendering for the event title
                <div className={"p-4 text-center"}>{highestRated.eventTitle}</div>
            )}
            <div>Popularity Score: {highestRated.highScore}</div>
          </div>


        </div>

      </div>
  )
}

export default App
