import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Jumbotron, Button, Container } from 'reactstrap';
//import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { loadUser } from '../../actions/authActions';

class Landing extends Component {
  componentDidMount() {
    this.props.loadUser();
  }

  render() {
    return (
      <div>
        <Jumbotron>
          <Container>
            <h1 className='display-3'>QUT Booking</h1>
            <p className='lead'>Create and manage appointments is easy</p>
            <hr className='my-2' />
            {this.props.isAuthenticated && (
              <h2>Welcome {this.props.auth_info.user}</h2>
            )}
            <p className='lead'>
              {!this.props.isAuthenticated && (
                <Button color='primary' className='text-white'>
                  <a
                    href={this.props.auth_info.signInUrl}
                    style={{ color: 'white', textDecoration: 'none' }}
                  >
                    <i className='fab fa-microsoft mr-2'></i>
                    Login with Microsoft
                  </a>
                </Button>
              )}
            </p>
          </Container>
        </Jumbotron>
      </div>
    );
  }
}

Landing.propTypes = {
  isAuthenticated: PropTypes.bool,
  auth_info: PropTypes.object.isRequired,
  loadUser: PropTypes.func.isRequired
};

const mapStateToProps = (state, ownProps) => {
  return {
    isAuthenticated: state.myauth.isAuthenticated,
    auth_info: state.myauth.auth_info
  };
};

export default connect(
  mapStateToProps,
  { loadUser }
)(Landing);
