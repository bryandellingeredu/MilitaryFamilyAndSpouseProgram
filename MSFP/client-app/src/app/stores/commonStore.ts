import { makeAutoObservable, reaction } from "mobx";
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
}