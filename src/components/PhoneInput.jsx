import React from 'react';

import countryCodes from '../lib/country-codes';

const formatCountries = data =>
  Object.keys(data)
    .map(country => ({ country, label: data[country].label }))
    .sort(({ label: a }, { label: b }) => {
      if (a < b) return -1;
      if (a > b) return 1;
      return 0;
    });

export default class PhoneInput extends React.Component {

  constructor(props) {
    const { country } = props;

    super(props);

    this.countries = formatCountries(countryCodes);

    this.state = {
      number: '',
      country: country || null,
    };
  }

  onPrefixChange(e) {
    const { onChange = () => {} } = this.props;

    const country = e.target.value;
    this.setState({ country });

    const prefix = `+${countryCodes[country].value}`;
    onChange(`${prefix}${this.state.number}`);
  }

  onInputChange(e) {
    const { onChange = () => {} } = this.props;

    const number = e.target.value.replace(/[^\d]/g, ''); // only allow numbers and plus sign
    this.setState({ number });

    // FIXME: replace number's leading zeroes -- for what?

    const prefix = this.state.country ? `+${countryCodes[this.state.country].value}` : '';
    onChange(`${prefix}${number}`);
  }

  onKeyPress(e) {
    const { onEnter = () => {} } = this.props;

    if (e.key === 'Enter') {
      onEnter();
    }
  }

  render() {
    const { placeholder, disabled } = this.props;
    const prefix = this.state.country ? `+${countryCodes[this.state.country].value}` : '';

    return (
      <div>
        {prefix}
        <img src={`images/flags/${this.state.country}.svg`} alt={prefix} />
        <select
          onChange={e => this.onPrefixChange(e)}
        >
          {this.countries.map(({ country, label }) => (
            <option key={country} value={country}>{label}</option>
          ))}
        </select>
        <input
          onChange={e => this.onInputChange(e)}
          onKeyPress={e => this.onKeyPress(e)}
          placeholder={placeholder}
          disabled={disabled}
        />
      </div>
    );
  }
}
