import React from 'react';

import countryCodes from './country-codes';

const formatCountries = data => 
  Object.keys(data)
    .map(country => ({ country, label: data[country].label }))
    .sort(({ label: a }, { label: b }) => 
    {
      if (a < b) return -1;
      if (a > b) return 1;
      return 0;
    });

export default class PhoneInput extends React.Component {
  
  constructor(props)
  {
    super(props);
          
    this.countries = formatCountries(countryCodes);
    
    this.state = {
      number: props.value || "",
      country: props.country || null,
    };
  }
  
  onPrefixChange(e) {
    const country = e.target.value;
    this.setState({ country });
    
    const prefix = `+${countryCodes[country].value}`;
    this.props.onChange(`${prefix}${this.state.number}`);
  }
  
  onInputChange(e) {
    const number = e.target.value.replace(/[^\d]/g, ''); // only allow numbers and plus sign
    this.setState({ number });
        
    // FIXME: replace number's leading zeroes -- for what?
  
    const prefix = this.state.country ? `+${countryCodes[this.state.country].value}` : "";
    this.props.onChange(`${prefix}${number}`);
  }
  
  render()
  {
    const prefix = this.state.country ? `+${countryCodes[this.state.country].value}` : "";
    
    return <div>
      {prefix}
      <img src={`images/flags/${this.state.country}.svg`} alt={prefix} />
      <select
        onChange={e => this.onPrefixChange(e)}
      >
        {this.countries.map(({ country, label }) => 
          <option key={country} value={country}>{label}</option>
        )}
      </select>
      <input 
        className="hello" 
        onChange={e => this.onInputChange(e)}
      />
    </div>
  }
};