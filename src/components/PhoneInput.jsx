import React from 'react';

import countryCodes from '../lib/country-codes';

const countryCode = code => countryCodes[code][0];

const formatCountries = data =>
  Object.keys(data)
    .map(country => ({ country, label: data[country][1] }))
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

    const prefix = `+${countryCode(country)}`;
    onChange(`${prefix}${this.state.number}`);
  }

  onInputChange(e) {
    const { onChange = () => {} } = this.props;

    const number = e.target.value.replace(/[^\d]/g, ''); // only allow numbers and plus sign
    this.setState({ number });

    // FIXME: replace number's leading zeroes -- for what?

    const prefix = this.state.country ? `+${countryCode(this.state.country)}` : '';
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
    const prefix = this.state.country ? `+${countryCode(this.state.country)}` : '';

    return (
      <div className="app-banner__phone-input">
        <span className="app-banner__phone-input-select-container">
          <img
            className="app-banner__phone-input-flag"
            src={`images/flags/${this.state.country}.svg`}
            alt={prefix}
          />
          <span className="app-banner__phone-input-select-value">
            {prefix}
          </span>
          <select
            onChange={e => this.onPrefixChange(e)}
            className="app-banner__phone-input-select"
          >
            {this.countries.map(({ country, label }) => (
              <option key={country} value={country}>{label}</option>
            ))}
          </select>
        </span>
        <input
          className="app-banner__phone-input-number"
          onChange={e => this.onInputChange(e)}
          onKeyPress={e => this.onKeyPress(e)}
          placeholder={placeholder}
          disabled={disabled}
        />
      </div>
    );
  }
}
