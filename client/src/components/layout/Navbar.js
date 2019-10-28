import React, { Component, Fragment } from 'react';
//import { Link } from 'react-router-dom';
import {
  Collapse,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavItem,
  NavLink,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem
} from 'reactstrap';
import { loadUser } from '../../actions/authActions';
import PropTypes from 'prop-types';

import qut from '../../qut.png';
import { connect } from 'react-redux';

class AppNavbar extends Component {
  state = {
    isOpen: false
  };

  componentDidMount() {
    this.props.loadUser();
  }

  toggle = () => {
    this.setState({ isOpen: !this.state.isOpen });
  };

  render() {
    return (
      <div>
        <Navbar color='dark' dark expand='sm' className='mb-3'>
          <NavbarBrand href='/'>
            <img
              src={qut}
              style={{ width: '40px' }}
              className='mr-2'
              alt='logo'
            ></img>
            QUT Booking
          </NavbarBrand>
          <NavbarToggler onClick={this.toggle} />
          <Collapse isOpen={this.state.isOpen} navbar>
            {this.props.isAuthenticated && (
              <Fragment>
                <Nav className='mr-auto' navbar>
                  <UncontrolledDropdown nav inNavbar>
                    <DropdownToggle nav caret>
                      Service
                    </DropdownToggle>
                    <DropdownMenu right>
                      <DropdownItem href='/business/create'>
                        New Service
                      </DropdownItem>
                      <DropdownItem href='/business/list'>
                        Manage Services
                      </DropdownItem>
                    </DropdownMenu>
                  </UncontrolledDropdown>

                  <NavItem>
                    <NavLink href='/business/publish'>
                      <strong>PUBLISH</strong>
                    </NavLink>
                  </NavItem>
                </Nav>

                <Nav className='ml-auto' navbar>
                  <NavItem>
                    <NavLink href='http://localhost:3000/authorize/signout'>
                      <strong>Sign Out</strong>
                    </NavLink>
                  </NavItem>
                </Nav>
              </Fragment>
            )}
          </Collapse>
        </Navbar>
      </div>
    );
  }
}

AppNavbar.propTypes = {
  isAuthenticated: PropTypes.bool,
  loadUser: PropTypes.func.isRequired
};

const mapStateToProps = state => {
  return {
    isAuthenticated: state.myauth.isAuthenticated
  };
};

export default connect(
  mapStateToProps,
  { loadUser }
)(AppNavbar);
