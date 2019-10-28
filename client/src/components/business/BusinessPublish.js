import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { loadUser } from '../../actions/authActions';
import { connect } from 'react-redux';
import {
  Card,
  CardHeader,
  CardBody,
  CardTitle,
  Container,
  Alert
} from 'reactstrap';

class BusinessPublish extends Component {
  componentDidMount() {
    this.props.loadUser();
  }

  render() {
    return (
      <div>
        <Container>
          {this.props.isAuthenticated ? (
            <Card className='text-center'>
              <CardHeader
                color='primary'
                style={{ backgroundColor: 'darkgreen', color: 'white' }}
              >
                <b>Your Business Booking</b>
              </CardHeader>
              <CardBody>
                <CardTitle>
                  <h4 className='mb-4'>
                    Copy the following URL and send it to your customers
                  </h4>
                  <span className='border rounded-lg p-2'>
                    http://localhost:5000/events/create/
                    {this.props.auth_info.email}
                  </span>
                </CardTitle>
              </CardBody>
            </Card>
          ) : (
            <Alert color='info'>
              Not authorised. Please{' '}
              <a href={this.props.auth_info.signInUrl} className='alert-link'>
                Login
              </a>{' '}
              to manage businesses
            </Alert>
          )}
        </Container>
      </div>
    );
  }
}

BusinessPublish.propTypes = {
  isAuthenticated: PropTypes.bool,
  auth_info: PropTypes.object.isRequired,
  loadUser: PropTypes.func.isRequired
};

const mapStateToProps = state => {
  return {
    isAuthenticated: state.myauth.isAuthenticated,
    auth_info: state.myauth.auth_info
  };
};

export default connect(
  mapStateToProps,
  { loadUser }
)(BusinessPublish);
