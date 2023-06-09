import { FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { faWindows } from "@fortawesome/free-brands-svg-icons";
import { Header, Segment, Button, SegmentGroup, Icon} from "semantic-ui-react";
import CopyToClipboard from "./CopyToClipboard";

const faWindowsPropIcon = faWindows as IconProp;

interface Props{
    setPage: (newPage: string) => void;
  }

export default function Outlook({setPage}: Props){
    const handleGoBack = () => setPage("calendar");
    return(
       <>
        <Header as="h1" textAlign="center">
        <Header.Content>
        <FontAwesomeIcon icon={faWindowsPropIcon} size="2x" color="orange" style={{paddingRight: '10px'}} />
         Outlook iCal Subscription Instructions
          <Header.Subheader>  Subscribing to the MSFP Calendar will automatically sync any changes made to your outlook calendar and you will receive updates automatically.
       </Header.Subheader>
        </Header.Content>
      </Header>
      <Header as="h4" textAlign="center" >
              Copy the iCal feed Url:  {`${process.env.REACT_APP_API_FULL_URL}/SyncCalendar`}
              <span style={{ marginLeft: '50px' }} />
                 <CopyToClipboard text={`${process.env.REACT_APP_API_FULL_URL}/SyncCalendar` } />
             </Header>
      <SegmentGroup>
        <Segment content='Open Microsoft Outlook'></Segment>
        <Segment content='Click on "File" in the top left corner'></Segment>
        <Segment content='Select "Account Settings" and then "Account Settings" again from the drop-down menu.'></Segment>
        <Segment content='In the "Internet Calendars" section, click on "New"'></Segment>
        <Segment content='Enter the iCal feed URL into the text field and click on "Add"'></Segment>
        <Segment content='The calendar will now appear in the "Internet Calendars" section of the "Account Settings" window.'></Segment>
        <Segment content='To subscribe to the calendar, select it and click on "OK"'></Segment>
        <Segment><Button basic color='orange'icon labelPosition='left' onClick={handleGoBack}>
                <Icon name='backward' />
                Back To Calendar
        </Button>
        </Segment>
      </SegmentGroup>
     </>
    )

}