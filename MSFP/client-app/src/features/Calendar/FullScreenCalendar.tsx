import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from '@fullcalendar/timegrid';
import { useState, useEffect} from "react";
import tippy from 'tippy.js';
import 'tippy.js/dist/tippy.css';
import { useStore } from "../../app/stores/store";


export default function FullScreenCalendar() {
  const {commonStore} = useStore();
const{getDuration} = commonStore;
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
    
    return (
      <FullCalendar
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
    />
    )
}

