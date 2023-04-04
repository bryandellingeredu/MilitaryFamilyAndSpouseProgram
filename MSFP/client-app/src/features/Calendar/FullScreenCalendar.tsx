import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from '@fullcalendar/timegrid';
import { useState, useEffect} from "react";
import tippy from 'tippy.js';
import 'tippy.js/dist/tippy.css';
import { useStore } from "../../app/stores/store";
import { Loader } from 'semantic-ui-react'
import { Details } from "../../app/models/Details";
import { EventClickArg } from "@fullcalendar/core";
import FullCalendarModal from "./FullCalendarModal";


export default function FullScreenCalendar() {
  const {commonStore, modalStore} = useStore();
  const {openModal} = modalStore;
  const [isLoading, setIsLoading] = useState(true);
  const{getDuration} = commonStore;
  const [details, setDetails] = useState<Details>({title: '', description: '', location: '', duration: '', category: '', allDayEvent: false, start: new Date(), end: new Date()})
  const [height, setHeight] = useState(window.innerHeight - 200);
    useEffect(() => {
        const handleResize = () => {
          setHeight(window.innerHeight - 100);
        };
      
        window.addEventListener("resize", handleResize);
      
        return () => {
          window.removeEventListener("resize", handleResize);
        };
      }, []);
    
      const  handleMouseEnter = async (arg : any) =>{
        var content = `                  
        <p> <strong>Title: </strong> ${arg.event.title} </p>
        <p> <strong>Time: </strong> ${getDuration(arg.event.startStr, arg.event.endStr, arg.event.allDay)} </p>
        ${arg.event.extendedProps.description ? '<p><strong>Description: </strong>' + arg.event.extendedProps.description + '</p>' : '' }
        ${arg.event.extendedProps.primaryLocation ? '<p><strong>Location: </strong>' + arg.event.extendedProps.primaryLocation + '</p>' : '' }
        ${arg.event.extendedProps.educationalCategory ? '<p><strong>Category: </strong>' + arg.event.extendedProps.educationalCategory + '</p>' : '' }
         `;
       var tooltip : any = tippy(arg.el, {     
          content,
          allowHTML: true,
        });
    }

    const handleEventClick = (clickInfo: EventClickArg) => {
      debugger;
      const _details = {
        title: clickInfo.event.title,
        description: clickInfo.event.extendedProps.description,
        location:  clickInfo.event.extendedProps.primaryLocation,
        duration: getDuration(clickInfo.event.startStr, clickInfo.event.endStr, clickInfo.event.allDay),
        category: clickInfo.event.extendedProps.educationalCategory,
        allDayEvent: clickInfo.event.allDay,
        start: clickInfo.event.start ? clickInfo.event.start : new Date() ,
        end: clickInfo.event.end ? clickInfo.event.end : new Date()}
        setDetails(_details)
        openModal(<FullCalendarModal details={_details} />, 'large')
    } 
    
    return (
      <>
      {isLoading && (
         <Loader active size='large' style={{marginTop: '100px'}}>
           Loading events...
         </Loader>
        )}
      <FullCalendar
       eventClick={handleEventClick}
      height= {height}
      initialView="timeGridWeek"
      headerToolbar={{
        left: "prev,next",
        center: "title",
        right: "dayGridMonth,timeGridWeek,timeGridDay"
      }}
      plugins={[dayGridPlugin, timeGridPlugin]}
      events={`${process.env.REACT_APP_API_URL}/Activities/geEventsByDate`} 
      slotMinTime={'07:00:00'}
      slotMaxTime={'21:00:00'} 
      eventMouseEnter={handleMouseEnter} 
      loading={(isLoading) => setIsLoading(isLoading)}
    />
    </>
    )
}

