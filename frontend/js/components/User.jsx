import React, { Component } from 'react';
import { connect } from 'react-redux';
import { autobind } from 'core-decorators';

import { getUser } from '../selectors/user/data';

import ExternalA from './ExternalA.jsx';


class User extends Component {
  @autobind
  renderMemberTypeName() {
    const { user, subUser } = this.props;
    const { household } = user;

    let memberTypeName = 'Ikke medlem';
    if (household.mainMember && household.mainMember.id === user.id) {
      memberTypeName = 'Hovedmedlem';
    } else if (household.isFamilyMember) {
      memberTypeName = 'Familiemedlem';
    } else if (household.isHouseholdMember) {
      memberTypeName = 'Hustandsmedlem';
    } else if (user.member.isValid) {
      memberTypeName = 'Medlem';
    }

    return (
      <div>
        {memberTypeName}
      </div>
    );
  }

  @autobind
  renderMembershipStatus() {
    const { user } = this.props;
    const currentYear = new Date().getFullYear();
    const nextYear = new Date(currentYear + 1, 1, 1).getFullYear();
    let showRenewLink = false;

    let membershipStatus = null;
    if (user.member.isValid) {
      if (user.member.status.nextYear) {
        membershipStatus = `Medlem ut ${currentYear}, samt hele ${nextYear}`;
      } else if (user.member.status.isNewMembershipYear) {
        membershipStatus = `Medlem ut ${currentYear}, men ikke ${nextYear}`;
        showRenewLink = true;
      } else {
        membershipStatus = `Medlem ${currentYear}`;
      }
    } else if (user.member.memberid) {
      membershipStatus = `Ikke betalt for ${currentYear}`;
      showRenewLink = true;
    }

    return !membershipStatus ? null : (
      <div>
        {membershipStatus}
        {!showRenewLink ? null : (
          <span>
            {' '}
            -
            {' '}
            <ExternalA href="https://www.dnt.no/minside/">
              Forny
            </ExternalA>
          </span>
        )}
      </div>
    );
  }

  @autobind
  renderMembershipLinks() {
    const { user } = this.props;
    const currentYear = new Date().getFullYear();
    const nextYear = new Date(currentYear + 1, 1, 1).getFullYear();

    let link = null;
    if (user.member.isValid
        && !user.member.status.nextYear
        && user.member.status.isNewMembershipYear) {
      link = (
        <ExternalA href="https://www.dnt.no/minside/">
          Forny ditt medlemsskap for {nextYear}
        </ExternalA>
      );
    } else if (user.member.memberid && !user.member.isValid) {
      link = (
        <ExternalA href="https://www.dnt.no/minside/">
          Forny ditt medlemsskap
        </ExternalA>
      );
    } else if (!user.member.isValid) {
      link = (
        <ExternalA href="https://www.dnt.no/medlem/">
          Bli medlem
        </ExternalA>
      );
    }

    return user.member.isValid || user.member.memberid ? null : (
      <div className="box__section">
        <ExternalA href="https://www.dnt.no/medlem/">
          Bli medlem
        </ExternalA>
      </div>
    );
  }

  @autobind
  renderMemberid() {
    const { user } = this.props;

    if (!user.member.memberid) {
      return null;
    }

    return (
      <div>
        Medlemsnummer: {user.member.memberid}
      </div>
    );
  }

  @autobind
  renderBirthDate() {
    const { user } = this.props;

    return (
      <div>
        Fødselsdato:
        {' '}
        {user.birthDate ? user.birthDate : (
          <em>Ukjent</em>
        )}
      </div>
    );
  }

  @autobind
  renderAssociationName() {
    const { user } = this.props;
    const { association } = user;

    if (!association || !association.name) {
      return null;
    }

    return (
      <div>
        Medlemsforening: {association.name}
      </div>
    );
  }

  @autobind
  renderMainUser() {
    const { user } = this.props;
    const className = user.member.isValid
      ? 'box'
      : 'box box--invalid';

    return (
      <div className={className}>
        <div className="box__section">
          <h3 className="heading--name">
            {user.name}
          </h3>
          {this.renderMemberTypeName()}
        </div>

        <div className="box__section">
          {this.renderMembershipStatus()}
          {this.renderMemberid()}
        </div>

        <div className="box__section">
          {this.renderBirthDate()}
          {this.renderAssociationName()}
        </div>

        {this.renderMembershipLinks()}
      </div>
    );
  }

  @autobind
  renderSubUser() {
    const { user } = this.props;
    const className = user.member.isValid
      ? 'box box--small'
      : 'box box--small box--invalid';

    return (
      <div className={className}>
        <div className="box__section">
          <h3 className="heading--name">
            {user.name}
          </h3>
          {this.renderBirthDate()}
          {this.renderMembershipStatus()}
          {this.renderMemberid()}
        </div>
      </div>
    );
  }

  render() {
    const { subUser } = this.props;
    return subUser
      ? this.renderSubUser()
      : this.renderMainUser();
  }
}


const connectedComponent = connect()(User);

export default connectedComponent;
