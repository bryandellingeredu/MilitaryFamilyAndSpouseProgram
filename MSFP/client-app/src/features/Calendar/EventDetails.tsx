import { Button, Icon, Divider, Header, Segment, SegmentGroup } from "semantic-ui-react";
import { Details } from "../../app/models/Details";
import { useStore } from "../../app/stores/store";


interface Props {
    details: Details
}


export default function EventDetails({details} : Props) {
  const {commonStore} = useStore();
  const {createICSFile} = commonStore
  const mailSubject = encodeURIComponent("Event Details: " + details.title);
  const mailBody = encodeURIComponent(
    "Event Details:\n" +
      "Title: " +
      details.title +
      "\nDuration: " +
      details.duration +
      "\nDescription: " +
      details.description +
      (details.location ? "\nLocation: " + details.location : "") +
      (details.category ? "\nCategory: " + details.category : "")
  );
  const handleAddToCalendar = () =>{
    const icsFile = createICSFile(details);
    let blob = new Blob([icsFile], { type: 'text/calendar;charset=utf-8' });
    let url = URL.createObjectURL(blob);
    let a = document.createElement('a');
    a.href = url;
    a.download = `${details.title}.ics`;
    a.click();
 }
    return(
    <>
     <Divider/>
     <a href={`mailto:?subject=${mailSubject}&body=${mailBody}`} style={{ textDecoration: "none" }}>
     <Button basic color='orange'icon labelPosition='left'>
     <Icon name='mail' />
      Email
     </Button>
     </a>
     <Button basic color='orange'icon labelPosition='right' onClick={handleAddToCalendar}>
     <Icon name='calendar' />
      Add to Calendar
     </Button>
        <Header textAlign="center">
          <Header.Content>
          {details.title.length > 50 ? details.title.substring(0, 50) + "..." : details.title}
          </Header.Content>
          <Header.Subheader>
            {details.duration}
          </Header.Subheader>
        </Header>
        
   
      <SegmentGroup>
          <Segment>
            <strong>Description:</strong> {details.description}
          </Segment>
          {details.location &&
             <Segment>
             <strong>Location:</strong> {details.location}
           </Segment>
          }
          {details.category &&
          <Segment>
             <strong>Category:</strong> {details.category}
          </Segment>
          }
        </SegmentGroup>
        </>
)}