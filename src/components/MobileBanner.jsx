import React from 'react';

export default class MobileBanner extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      dismissed: false,
    };
  }

  handleDismiss() {
    // STOP PROPAGATION
    const { onDismiss } = this.props;

    this.setState({ dismissed: true });
    onDismiss();
  }

  render() {
    const { url, app, locale } = this.props;
    const { dismissed } = this.state;

    if (dismissed) {
      return null;
    }

    return (
      <div>
        <img alt="" id="dismiss" src="dismiss.svg" onClick={e => this.handleDismiss(e)} />
        {app.name}
        {app.publisher}
        <a href={app.url}>
          <img alt="" src={app.icon} />
          {locale.cta}
          {locale.view}
        </a>
      </div>
    );
  }
}
