import { Menu,Container, Dropdown, Image, Header } from "semantic-ui-react";


export default function Navbar(){
    return (
      <Menu inverted fixed='top'>
            <Container fluid>
            <Menu.Item position="left">
              <Dropdown item icon='bars' simple>
  
                <Dropdown.Menu>
                <Dropdown.Item>One</Dropdown.Item>
                <Dropdown.Item>Two</Dropdown.Item>
                <Dropdown.Item>Three</Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
              </Menu.Item>
              <Menu.Item header >   
               <h3>Military Spouse and Family Program</h3> 
  
                  
              </Menu.Item>
              <Menu.Item position="right" >
              <Image src={`${process.env.PUBLIC_URL}//assets/armylogo-90-dark.svg`} size='tiny' floated="right" />
              </Menu.Item>
              
              </Container>
        </Menu>
    )
}