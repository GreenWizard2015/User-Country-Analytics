import React, { Component } from 'react';
import { connect } from 'react-redux';
import { removeNotification, addNotification } from 'store/notificationsSlice';

class Notifications extends Component {
  renderNotifications() {
    const { notifications, removeNotification } = this.props;
    console.log('notifications', notifications);
    return notifications.map((notification, index) => {
      return (
        <div key={notification.id} className="notification" onClick={() => removeNotification(notification.id)}>
          <div className="notification-title">{notification.title}</div>
          <div className="notification-message">{notification.message}</div>
        </div>
      )
    });
  }

  render() {
    if (this.props.notifications.length === 0) return null;
    return (
      <div className="notifications-container">
        {this.renderNotifications()}
      </div>
    );
  }
}

export default connect(
  state => ({ notifications: state.notifications }),
  { removeNotification, addNotification }
)(Notifications);