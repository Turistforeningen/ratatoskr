import React, { Component } from 'react';
import { connect } from 'react-redux';
import { autobind } from 'core-decorators';
import { getTranslate } from 'react-localize-redux';

import { getUser } from '../../selectors/user/data';

import ExternalA from '../common/ExternalA.jsx';


class User extends Component {
  @autobind
  renderMemberTypeName() {
    const { user, subUser, translate } = this.props;
    const { household } = user;

    let memberTypeName = translate('membership_details.types.not_member');
    if (household.mainMember && household.mainMember.id === user.id) {
      memberTypeName = translate('membership_details.types.Hovedmedlem');
    } else if (household.isFamilyMember) {
      memberTypeName = translate('membership_details.types.Familiemedlem');
    } else if (household.isHouseholdMember) {
      memberTypeName = translate('membership_details.types.Husstandsmedlem');
    } else if (user.member.isValid) {
      memberTypeName = translate('membership_details.types.member');
    }

    return (
      <div>
        {memberTypeName}
      </div>
    );
  }

  @autobind
  renderMembershipStatus() {
    const { user, translate } = this.props;
    let showRenewLink = false;

    let membershipStatus = null;
    if (user.member.isValid) {
      if (user.member.status.nextYear) {
        membershipStatus = translate(
          'membership_details.user.status.next_year'
        );
      } else if (user.member.status.isNewMembershipYear) {
        membershipStatus = translate(
          'membership_details.user.status.not_next_year'
        );
        showRenewLink = true;
      } else {
        membershipStatus = translate(
          'membership_details.user.status.current_year'
        );
      }
    } else if (user.member.memberid) {
      membershipStatus = translate(
        'membership_details.user.status.invalid'
      );
      showRenewLink = true;
    }

    if (membershipStatus) {
      const currentYear = new Date().getFullYear();
      const nextYear = new Date(currentYear + 1, 1, 1).getFullYear();
      membershipStatus = membershipStatus
        .replace('{currentYear}', currentYear)
        .replace('{nextYear}', nextYear);
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
            { translate('membership_details.user.status.renew') }
            </ExternalA>
          </span>
        )}
      </div>
    );
  }

  @autobind
  renderMembershipLinks() {
    const { user, translate } = this.props;

    return user.member.isValid || user.member.memberid ? null : (
      <div className="box__section">
        <ExternalA href="https://www.dnt.no/medlem/">
          { translate('membership_details.user.become_member') }
        </ExternalA>
      </div>
    );
  }

  @autobind
  renderMemberid() {
    const { user, translate } = this.props;

    if (!user.member.memberid) {
      return null;
    }

    return (
      <div>
        { translate('membership_details.user.memberid') }:{' '}
        {user.member.memberid}
      </div>
    );
  }

  @autobind
  renderBirthDate() {
    const { user, translate } = this.props;

    return (
      <div>
        { translate('membership_details.user.birth_date') }:
        {' '}
        {user.birthDate ? user.birthDate : (
          <em>
            { translate('membership_details.user.birth_date_unknown') }
          </em>
        )}
      </div>
    );
  }

  @autobind
  renderAssociationName() {
    const { user, translate } = this.props;
    const { association, localAssociation } = user;

    if (!association || !association.name) {
      return null;
    }

    return (
      <div>
        <div>
          { translate('membership_details.user.association') }:{' '}
          {association.name}
        </div>
        {!!localAssociation && (
          <div>
            { translate('membership_details.user.local_association') }:{' '}
            {localAssociation.name}
          </div>
        )}
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


const mapStateToProps = (state) => ({
  translate: getTranslate(state.locale),
});


const connectedComponent = connect(mapStateToProps)(User);

export default connectedComponent;
