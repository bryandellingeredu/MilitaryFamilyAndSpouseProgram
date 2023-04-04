import { makeAutoObservable, reaction } from "mobx";
import { Details } from "../models/Details";
export default class CommonStore{

    
    constructor() {
        makeAutoObservable(this);
    }

getDuration =  (startStr: string, endStr: string, allDay: boolean): string  => {
    const start = new Date(startStr);
    if (allDay) {
      start.setDate(start.getDate() + 1);
    }
    const end = new Date(endStr);
    const formatterDate = new Intl.DateTimeFormat('en-US', { month: 'long', day: 'numeric' });
    const startDate : string = formatterDate.format(start);
    const endDate : string = formatterDate.format(end);
    if(allDay){
      if(startDate === endDate) return startDate;
      return `${startDate} - ${endDate}`;   
    }else{
      const formatterTime = new Intl.DateTimeFormat('en-US', { hour: 'numeric', minute:'numeric', hour12: true });
      const formattedStartedTime = formatterTime.format(start);
      const formattedEndTime = formatterTime.format(end);
      return (startDate === endDate) ? `${startDate} ${formattedStartedTime} - ${formattedEndTime}` : `${startDate} ${formattedStartedTime} - ${endDate} ${formattedEndTime}` 
    }
  }

  createICSFile = (details: Details) => {
    let location = details.location;
    const url = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'BEGIN:VEVENT',
    'CLASS:PUBLIC',
    `DESCRIPTION:${details.title}`,
    `DTSTART${details.allDayEvent?'VALUE=DATE:':':'}${this.convertDateToGraph(details.start, details.allDayEvent, false).replace(/[^\w\s]/gi, '').substring(0, 15)}`,
    `DTEND${details.allDayEvent?'VALUE=DATE:':':'}${this.convertDateToGraph(details.end, details.allDayEvent, true).replace(/[^\w\s]/gi, '').substring(0, 15)}`,
    `LOCATION:${location||'N/A'}`,
    `SUMMARY;LANGUAGE=en-us:${details.title}`,
    'TRANSP:TRANSPARENT',
    'END:VEVENT',
    'END:VCALENDAR'
    ].join('\n');

    return url;
  }

  convertDateToGraph = (dt: Date, isAllDay: boolean, isEndDt: boolean): string => {
    let date : Date = new Date();
    if(typeof dt === 'string'){
        date = new Date(dt)
    } else{
        date = dt;
    }
    
    if(isEndDt && isAllDay){
        date = this.addDays(date,1);
    }
    const year = date.getFullYear().toString();
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0")
    const hour = ("0" + date.getHours()).slice(-2);
    const minute = ("0" + date.getMinutes()).slice(-2);
    const datePartOfIsoString = `${year}-${month}-${day}`;
    const convertedDate = isAllDay 
    ? `${datePartOfIsoString}T00:00:00.0000000`
    : `${datePartOfIsoString}T${hour}:${minute}:00.0000000`
    return convertedDate;
  }

  addDays = (date: Date, num: number): Date =>{
    const newDate = new Date(date);
    return new Date(newDate.setDate(newDate.getDate() + num));
  }


}