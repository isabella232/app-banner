import React from 'react';

import countryCodes from '../lib/country-codes';

import s from '../main.scss';

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
    const { placeholder, disabled = '' } = this.props;
    const { country } = this.state;
    const prefix = country ? `+${countryCode(country)}` : '';

    // const className = `${error ? s.banner__phone_input_error : ''} ${s.banner__phone_input}`;

    return (
      <div className={s.banner__phone_input}>
        <span className={s.banner__phone_input_select_container}>
          <img
            className={s.banner__phone_input_flag}
            src={`images/flags/${country}.svg`}
            alt={prefix}
          />
          <span className={s.banner__phone_input_select_value}>
            {prefix}
          </span>
          <select
            onChange={e => this.onPrefixChange(e)}
            className={s.banner__phone_input_select}
            value={country || ''}
          >
            {this.countries.map(({ country: ct, label }) => (
              <option key={ct} value={ct}>{label}</option>
            ))}
          </select>
        </span>
        <input
          className={s.banner__phone_input_number}
          onChange={e => this.onInputChange(e)}
          onKeyPress={e => this.onKeyPress(e)}
          placeholder={placeholder}
          disabled={disabled}
        />
      </div>
    );
  }
}
