import React, { Component } from 'react';
import { connect } from 'react-redux';
import { autobind } from 'core-decorators';
import { setActiveLanguage } from 'react-localize-redux';

import { getLanguages } from '../../selectors/locale';


class LocaleMenu extends Component {
  @autobind
  setLanguage(lang) {
    const { actions } = this.props;
    return () => {
      actions.setActiveLanguage(lang);
      // Scroll to top
      window.scrollTo(0, 0);
    };
  }

  render() {
    const { languages } = this.props;

    return (
      <ul className="footer-menu">
        {languages.map((language) => (
          <li
            key={language.code}
            className="footer-menu__item">
            {language.active
              ? (
                <span className="arrow-pointer">{language.name}</span>
              )
              : (
                <a onClick={this.setLanguage(language.code)}>{language.name}</a>
              )
            }
          </li>
        ))}
      </ul>
    );
  }
}


const mapStateToProps = (state) => ({
  languages: getLanguages(state),
});


const connectedComponent = connect(
  mapStateToProps,
  {setActiveLanguage},
  (stateProps, dispatchProps, ownProps) =>
    Object.assign({}, ownProps, stateProps, {actions: dispatchProps})
)(LocaleMenu);

export default connectedComponent;
