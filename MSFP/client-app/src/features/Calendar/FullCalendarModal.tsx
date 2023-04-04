import { Button, Icon } from "semantic-ui-react";
import { Details } from "../../app/models/Details";
import { useStore } from "../../app/stores/store";
import EventDetails from "./EventDetails";

interface Props{
    details: Details
}

export default function FullCalendarModal({details}: Props){
    const { modalStore } = useStore();
    const {closeModal} = modalStore;

    
    return (
        <>
          <Button
          floated="right"
            icon
            size="mini"
            color="black"
            compact
            onClick={() => closeModal()}> 
            <Icon name="close" />
          </Button>
          <EventDetails details={details} />
          </>
    )

}