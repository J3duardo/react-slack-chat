import React, { Component } from 'react';
import{Grid, Header, Icon} from "semantic-ui-react";

class UserPanel extends Component {
  render() {
    return (
      <Grid style={{backgroundColor: "#4c3c4c"}}>
        <Grid.Column>
          <Grid.Row style={{padding: "1.2rem", margin: 0}}>
            <Header inverted floated="left" as="h2">
              <Icon name="code"/>
              <Header.Content>DevChat</Header.Content>
            </Header>
          </Grid.Row>
        </Grid.Column>
      </Grid>
    );
  }
}

export default UserPanel;