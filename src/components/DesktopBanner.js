import React from 'react';

import PhoneInput from './PhoneInput';

const BadgeApple = props => 
  <a href={props.url}>
    <img src='some icon' />
  </a>
  
const BadgeGoogle = props => 
  <a href={props.url}>
    <img src='some icon' />
  </a>

export default class DesktopBanner extends React.Component 
{
  constructor(props)
  {
    super(props);
    
    this.state = {
      dismissed: false,
      number: '',
    }
  }
  
  dismiss()
  {    
    const { onDismiss } = this.props;
    
    this.setState({ dismissed: true });
    onDismiss();
  }
  
  update(number)
  {
    this.setState({ number });
  }
  
  send()
  {
    const { onSend = () => {} } = this.props; // FIXME: shoud I rename this?
    
    onSend(this.state.number); 
  }
  
  render()
  {
    const { google, apple, onDismiss, onSend, locale, country } = this.props;
    const { dismissed } = this.state;
    
    let icon = null;
    if(google && google.icon)
      icon = google.icon;
    if(apple && apple.icon)
      icon = apple.icon;
    
    if(dismissed)
      return null;
    
    return <div>
      {(google && google.icon) ? <BadgeGoogle url={google.url} /> : null}
      {(apple && apple.icon) ? <BadgeApple url={apple.url} /> : null}
      
      <img src={icon}/>
      {locale.desktop_try}
      {locale.desktop_phone}
      <PhoneInput 
        onEnter={() => this.send()}
        onChange={val => this.update(val)}
        country={country}
      />
      <button onClick={e => this.dismiss()}>{locale.desktop_no_thanks}</button>
      <button onClick={e => this.send()}>{locale.desktop_send_link}</button>
    </div>
  }
}