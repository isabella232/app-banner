import React, { Component } from 'react';

import countryCodes from '../lib/country-codes';

import style from './css/PhoneInput.scss';

const countryCode = code => countryCodes[code][0];

const formatCountries = data =>
  Object.keys(data)
    .map(country => ({ country, label: data[country][1] }))
    .sort(({ label: a }, { label: b }) => {
      if (a < b) return -1;
      if (a > b) return 1;
      return 0;
    });

export default class PhoneInput extends Component {

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
    const { number } = this.state;

    const country = e.target.value;
    this.setState({ country });

    const prefix = `+${countryCode(country)}`;
    onChange(`${prefix}${number}`);
  }

  onInputChange(e) {
    const { onChange = () => {} } = this.props;
    const { country } = this.state;

    const number = e.target.value.replace(/[^\d]/g, ''); // only allow numbers here
    this.setState({ number });

    const prefix = country ? `+${countryCode(country)}` : '';
    onChange(`${prefix}${number}`);
  }

  onKeyPress(e) {
    const { onEnter = () => {} } = this.props;

    if (e.key === 'Enter') {
      onEnter();
    }
  }

  render() {
    const { placeholder, error, disabled = '' } = this.props;
    const { country } = this.state;
    const prefix = country ? `+${countryCode(country)}` : '';

    const className = `${error ? style.error : ''} ${style.input}`;

    return (
      <div className={className}>
        <span className={style.select_container}>
          <img
            className={style.flag}
            src={`images/flags/${country}.svg`}
            alt={prefix}
          />
          <span className={style.select_value}>
            {prefix}
          </span>
          <select
            onChange={e => this.onPrefixChange(e)}
            className={style.select}
            value={country || ''}
          >
            {this.countries.map(({ country: ct, label }) => (
              <option key={ct} value={ct}>{label}</option>
            ))}
          </select>
        </span>
        <input
          className={style.number}
          onChange={e => this.onInputChange(e)}
          onKeyPress={e => this.onKeyPress(e)}
          placeholder={placeholder}
          disabled={disabled}
        />
      </div>
    );
  }
}
