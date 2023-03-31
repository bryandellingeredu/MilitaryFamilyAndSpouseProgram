import { Header, Segment, SegmentGroup } from "semantic-ui-react";
import { Details } from "../../app/models/Details";


interface Props {
    details: Details
}


export default function EventDetails({details} : Props) {
    return(
    <>

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