import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { signOut } from '../../actions/authActions';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';

class SignOut extends Component {
  componentDidMount() {
    this.props.signOut();
  }

  render() {
    return <div>{this.props.isSignedOut && <Redirect to='/' />}</div>;
  }
}

SignOut.propTypes = {
  signOut: PropTypes.func.isRequired,
  isAuthenticated: PropTypes.bool,
  isSignedOut: PropTypes.bool
};

const mapStateToProps = state => {
  return {
    isAuthenticated: state.myauth.isAuthenticated,
    isSignedOut: state.myauth.isSignedOut
  };
};

export default connect(
  mapStateToProps,
  { signOut }
)(SignOut);
