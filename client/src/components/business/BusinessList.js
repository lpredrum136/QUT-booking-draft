import React, { Component } from 'react';
import { Container, Table, Button, Alert } from 'reactstrap';
import PropTypes from 'prop-types';
import { getBusinesses, deleteBusiness } from '../../actions/businessActions';
import { loadUser } from '../../actions/authActions';

import { connect } from 'react-redux';

class BusinessList extends Component {
  componentDidMount() {
    this.props.loadUser();
    console.log(this.props.isAuthenticated);
    console.log(this.props.auth_info.email);
    console.log('abc');
    this.props.getBusinesses(this.props.auth_info.email);
  }

  componentDidUpdate(prevProps) {
    console.log('didupdate');
    if (this.props.auth_info.email !== prevProps.auth_info.email)
      this.props.getBusinesses(this.props.auth_info.email);
    else {
      console.log(this.props.my_businesses);
    }
  }

  /*shouldComponentUpdate(nextProps) {
    console.log(nextProps.auth_info.email);
    console.log(this.props.auth_info.email);
    if (nextProps.auth_info.email !== this.props.auth_info.email) {
      console.log('diff');
      nextProps.getBusinesses(nextProps.auth_info.email);
    }
    return true;
  }*/

  onDeleteClick = id => {
    this.props.deleteBusiness(id);
  };

  render() {
    return (
      <div>
        <Container>
          {this.props.isAuthenticated ? (
            <Table hover>
              <thead
                style={{
                  backgroundColor: 'black',
                  color: 'white'
                }}
              >
                <tr>
                  <th>Service</th>
                  <th>Duration</th>
                  <th>Minimum lead time</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {this.props.my_businesses &&
                  this.props.my_businesses.map(business => {
                    return (
                      <tr key={business._id}>
                        <td>{business.name}</td>
                        <td>
                          {business.defaultHour} hour(s) {business.defaultMin}{' '}
                          minutes
                        </td>
                        <td>{business.minLead} hour(s)</td>
                        <td>
                          <Button color='info' className='text-white mr-1'>
                            <a
                              href={`/business/edit/${business._id}`}
                              style={{ color: 'white', textDecoration: 'none' }}
                            >
                              <i className='fas fa-pen mr-1'></i>
                              Edit
                            </a>
                          </Button>

                          <Button
                            color='danger'
                            className='text-white'
                            onClick={this.onDeleteClick.bind(
                              this,
                              business._id
                            )}
                          >
                            <i className='fas fa-trash-alt mr-1'></i>
                            Delete
                          </Button>
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </Table>
          ) : (
            <Alert color='info'>
              Not authorised. Please{' '}
              <Button color='primary' className='text-white mr-2'>
                <a
                  href={this.props.auth_info.signInUrl}
                  style={{ color: 'white', textDecoration: 'none' }}
                >
                  <i className='fab fa-microsoft mr-2'></i>
                  Login with Microsoft
                </a>
              </Button>
              to manage businesses
            </Alert>
          )}
        </Container>
      </div>
    );
  }
}

BusinessList.propTypes = {
  getBusinesses: PropTypes.func.isRequired,
  deleteBusiness: PropTypes.func.isRequired,
  isAuthenticated: PropTypes.bool,
  loadUser: PropTypes.func.isRequired,
  auth_info: PropTypes.object.isRequired,
  my_businesses: PropTypes.array.isRequired
};

const mapStateToProps = state => {
  return {
    isAuthenticated: state.myauth.isAuthenticated,
    auth_info: state.myauth.auth_info,
    my_businesses: state.mybusiness.businesses
  };
};

export default connect(
  mapStateToProps,
  { loadUser, getBusinesses, deleteBusiness }
)(BusinessList);
