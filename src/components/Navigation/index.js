import React from 'react';
import SignOutButton from '../SignOut';
import { Column } from 'simple-flexbox';
import { StyleSheet, css } from 'aphrodite';
import * as ROUTES from '../../constants/routes';
import { AuthUserContext } from '../Session';
import IconHome from '../../assets/icon-home.js';
import IconAccount from '../../assets/icon-account.js';
import IconCalendar from '../../assets/icon-calendar.js';
import MenuItemComponent from './MenuItemComponent';
import IconMeeting from '../../assets/icon-meeting.js';
const styles = StyleSheet.create({
  dummyContainer: {
    marginLeft: '6vw',
  },
  container: {
    position: 'fixed',
    backgroundColor: '#090A0B',
    width: '6vw',
    overflow: 'hidden',
    borderColor: '#363336',
    top: '0',
    left: '0'

  },
  menuCtn: {
    height: '96vh',
    marginBottom: '4vh'
  },
  menuItemList: {
    marginTop: '14vh'
  },
  separator: {
    borderTop: '1px solid #DFE0EB',
    marginTop: 16,
    marginBottom: 16,
    opacity: 0.06
  }
});

const Navigation = () => (
  <div>
    <AuthUserContext.Consumer>
      {authUser =>
        authUser ? <NavigationAuth /> : void 0
      }
    </AuthUserContext.Consumer>
  </div>
);

const NavigationAuth = () => (
  <div className={css(styles.dummyContainer)}>
  <Column className={css(styles.container)} >
    <Column className={css(styles.menuCtn)} >
      <Column className={css(styles.menuItemList)} >
        <MenuItemComponent
          path={ROUTES.HOME}
          title="Home" icon={IconHome}
        />
        <MenuItemComponent
          path={ROUTES.SHOW_TEAMS}
          title="Teams" icon={IconAccount}
        />
        <MenuItemComponent
          path={ROUTES.ROOM}
          title="Meeting" icon={IconMeeting}
        />
        <MenuItemComponent
          path={ROUTES.CALENDAR}
          title="Calendar" icon={IconCalendar}
        />
      </Column>
      <Column flexGrow={1}></Column>
     <SignOutButton />
    </Column>
  </Column>
  </div>
);

export default Navigation;