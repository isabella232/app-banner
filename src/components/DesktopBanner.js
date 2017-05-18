import React from 'react';

import PhoneInput from './PhoneInput';

export default class DesktopBanner extends React.Component 
{
  constructor(props)
  {
    super(props);
    
    this.state = {
      dismissed: false,
    }
  }
  
  dismiss()
  {    
    const { onDismiss } = this.props;
    
    this.setState({ dismissed: true });
    onDismiss();
  }
  
  render()
  {
    const { google, apple, onDismiss, onSend, locale } = this.props;
    const { dismissed } = this.state;
    
    let icon = null;
    if(google && google.icon)
      icon = google.icon;
    if(apple && apple.icon)
      icon = apple.icon;
    
    if(dismissed)
      return null;
    
    return <div>
      <img src={icon}/>
      {locale.desktop_try}
      {locale.desktop_phone}
      <PhoneInput />
      <button id='dismiss' onClick={e => this.dismiss()}>{locale.desktop_no_thanks}</button>
      <button id='send' onClick={onSend}>{locale.desktop_send_link}</button>
    </div>
  }
}