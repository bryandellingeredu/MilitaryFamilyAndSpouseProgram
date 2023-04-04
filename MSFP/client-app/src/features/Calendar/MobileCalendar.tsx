import FullCalendar from "@fullcalendar/react";
import listPlugin from '@fullcalendar/list';
import { useState,  useRef } from "react";
import { EventClickArg } from "@fullcalendar/core";
import { useStore } from "../../app/stores/store";
import { Details } from "../../app/models/Details";
import EventDetails from "./EventDetails";
import { Loader } from "semantic-ui-react";

export default function MobileCalendar() {
  const {commonStore} = useStore();
  const{getDuration} = commonStore;
   const calendarRef = useRef<FullCalendar>(null);

    const handleButtonClick = () => {
      setShowDetails(false);
    };
    const [isLoading, setIsLoading] = useState(true);
    const [showDetails, setShowDetails] = useState(false);
    const [details, setDetails] = useState<Details>({title: '', description: '', location: '', duration: '', category: '', allDayEvent: false, start: new Date(), end: new Date()})
    const handleEventClick = (clickInfo: EventClickArg) => {
      setShowDetails(true);
      console.log(clickInfo.event);
      setDetails({
        title: clickInfo.event.title,
        description: clickInfo.event.extendedProps.description,
        location:  clickInfo.event.extendedProps.primaryLocation,
        duration: getDuration(clickInfo.event.startStr, clickInfo.event.endStr, clickInfo.event.allDay),
        category: clickInfo.event.extendedProps.educationalCategory,
        allDayEvent: clickInfo.event.allDay,
        start: clickInfo.event.start ? clickInfo.event.start : new Date() ,
        end: clickInfo.event.end ? clickInfo.event.end : new Date()})
    } 

     const handleDatesSet = () => {
      handleButtonClick();
    }

    return (
      <>
         {isLoading && (
         <Loader active size='large' style={{marginTop: '100px'}}>
           Loading events...
         </Loader>
        )}
    <FullCalendar
      loading={(isLoading) => setIsLoading(isLoading)}
      ref={calendarRef}
      plugins={[listPlugin]}
      events={`${process.env.REACT_APP_API_URL}/Activities/geEventsByDate`}
        datesSet={handleDatesSet}
      eventClick={handleEventClick}
      initialView="listMonth"
      headerToolbar={{
        left: "prev,next",
        center: "title",
        right: "customMonth,customWeek,customDay"
      }}
customButtons={{
  customMonth: {
    text: "Month",
    click: () => {
      handleButtonClick();
      if (calendarRef.current) {
        calendarRef.current.getApi().changeView('listMonth');
      }
    }
  },
  customWeek: {
    text: "Week",
    click: () => {
      handleButtonClick();
      if (calendarRef.current) {
        calendarRef.current.getApi().changeView('listWeek');
      }
    }
  },
  customDay: {
    text: "Day",
    click: () => {
      handleButtonClick();
      if (calendarRef.current) {
        calendarRef.current.getApi().changeView('listDay');
      }
    }
  },
}}
      views={{
        customMonth: {
          type: "listMonth",
          title: "Month",
          buttonText: "Month"
        },
        customWeek: {
          type: "listWeek",
          title: "Week",
          buttonText: "Week"
        },
        customDay: {
          type: "listDay",
          title: "Day",
          buttonText: "Day"
        }
      }}
      slotMinTime={"07:00:00"}
      slotMaxTime={"21:00:00"}
      eventDisplay={'block'}
    />

  {showDetails && <EventDetails details={details} />  }
  </>
    )
}

