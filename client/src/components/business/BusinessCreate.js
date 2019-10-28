import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import {
  Card,
  CardBody,
  Container,
  Button,
  Form,
  FormGroup,
  Label,
  Input,
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  CustomInput,
  Col,
  Alert
} from 'reactstrap';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { loadUser } from '../../actions/authActions';
import { addBusiness } from '../../actions/businessActions';

class BusinessCreate extends Component {
  state = {
    name: '',
    address: '',
    phone: '',
    desc: '',
    website: '',
    startTime: '',
    endTime: '',
    defaultHour: '',
    defaultMin: '',
    minlead: '',
    maxlead: '',
    redirectToListBusiness: false
  };

  componentDidMount() {
    this.props.loadUser();
  }

  componentDidUpdate() {
    if (this.props.successAddBusiness) console.log('success add biz');
  }

  onChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };

  onSubmit = event => {
    event.preventDefault();

    console.log(this.state.redirectToListBusiness);

    if (!this.state.defaultHour) this.state.defaultHour = 0;

    if (!this.state.defaultMin) this.state.defaultMin = 0;

    const new_business_data = {
      owner: this.props.auth_info.user,
      email: this.props.auth_info.email,
      name: this.state.name,
      address: this.state.address,
      phone: this.state.phone,
      desc: this.state.desc,
      website: this.state.website,
      startTime: this.state.startTime,
      endTime: this.state.endTime,
      defaultHour: this.state.defaultHour,
      defaultMin: this.state.defaultMin,
      minlead: this.state.minlead,
      maxlead: this.state.maxlead
    };

    this.props.addBusiness(new_business_data);

    //this.setState({ redirectToListBusiness: true });
  };

  render() {
    return (
      <div>
        {/* {this.state.redirectToListBusiness && <Redirect to='/business/list' />} */}
        {this.props.successAddBusiness && <Redirect to='/business/list' />}
        <Container>
          {this.props.isAuthenticated ? (
            <Card className='mb-4'>
              <CardBody>
                <h3>Service Information</h3>
                <Form onSubmit={this.onSubmit}>
                  <FormGroup>
                    <Label for='name'>Service name</Label>
                    <Input
                      type='text'
                      name='name'
                      id='name'
                      placeholder='What is it?'
                      required
                      onChange={this.onChange}
                    />
                  </FormGroup>

                  <FormGroup>
                    <Label for='address'>Location</Label>
                    <Input
                      type='text'
                      name='address'
                      id='address'
                      placeholder='Where is it?'
                      required
                      onChange={this.onChange}
                    />
                  </FormGroup>

                  <FormGroup>
                    <Label for='phone'>Phone number</Label>
                    <Input
                      type='text'
                      name='phone'
                      id='phone'
                      placeholder='Clients can call you at...'
                      required
                      onChange={this.onChange}
                    />
                  </FormGroup>

                  <FormGroup>
                    <Label for='desc'>Description</Label>
                    <Input
                      type='text'
                      name='desc'
                      id='desc'
                      placeholder='What does your service do?'
                      onChange={this.onChange}
                    />
                  </FormGroup>

                  <FormGroup>
                    <Label for='website'>Website</Label>
                    <Input
                      type='url'
                      name='website'
                      id='website'
                      placeholder='Where can clients find you on the Internet?'
                      onChange={this.onChange}
                    />
                  </FormGroup>

                  <FormGroup>
                    <Label for='businessHours'>
                      Business Hours (12-hour format)
                    </Label>

                    <InputGroup className='mb-3' inline='true'>
                      <InputGroupAddon addonType='prepend'>
                        <InputGroupText>From</InputGroupText>
                      </InputGroupAddon>
                      <Input
                        type='time'
                        name='startTime'
                        id='startTime'
                        placeholder='time placeholder'
                        className='mr-3'
                        onChange={this.onChange}
                        required
                      />

                      <InputGroupAddon addonType='prepend'>
                        <InputGroupText>To</InputGroupText>
                      </InputGroupAddon>
                      <Input
                        type='time'
                        name='endTime'
                        id='endTime'
                        placeholder='time placeholder'
                        onChange={this.onChange}
                        required
                      />
                    </InputGroup>
                  </FormGroup>

                  <FormGroup>
                    <Label for='duration'>Default Duration</Label>

                    <InputGroup className='mb-3' inline='true'>
                      <CustomInput
                        type='select'
                        name='defaultHour'
                        id='durationHour'
                        onChange={this.onChange}
                      >
                        <option value='0'>0</option>
                        <option value='1'>1</option>
                        <option value='2'>2</option>
                        <option value='3'>3</option>
                        <option value='4'>4</option>
                      </CustomInput>

                      <InputGroupAddon addonType='append' className='mr-3'>
                        <InputGroupText>Hours</InputGroupText>
                      </InputGroupAddon>

                      <CustomInput
                        type='select'
                        name='defaultMin'
                        id='durationMinute'
                        onChange={this.onChange}
                      >
                        <option value='0'>0</option>
                        <option value='15'>15</option>
                        <option value='30'>30</option>
                        <option value='45'>45</option>
                      </CustomInput>

                      <InputGroupAddon addonType='append'>
                        <InputGroupText>Minutes</InputGroupText>
                      </InputGroupAddon>
                    </InputGroup>
                  </FormGroup>

                  <FormGroup row>
                    <Label for='minlead' sm={6}>
                      Minimum lead time for bookings (in hours)
                    </Label>
                    <Col sm={6}>
                      <Input
                        type='number'
                        name='minlead'
                        id='minlead'
                        placeholder='...hours'
                        min='1'
                        required
                        onChange={this.onChange}
                      />
                    </Col>
                  </FormGroup>

                  <FormGroup row>
                    <Label for='maxlead' sm={6}>
                      Maximum number of business days in advance that a booking
                      can be made
                    </Label>
                    <Col sm={6}>
                      <Input
                        type='number'
                        name='maxlead'
                        id='maxlead'
                        placeholder='...days'
                        min='1'
                        max='10'
                        required
                        onChange={this.onChange}
                      />
                    </Col>
                  </FormGroup>

                  <Button color='primary'>Submit</Button>
                </Form>
              </CardBody>
            </Card>
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

BusinessCreate.propTypes = {
  isAuthenticated: PropTypes.bool,
  auth_info: PropTypes.object.isRequired,
  successAddBusiness: PropTypes.bool.isRequired,
  loadUser: PropTypes.func.isRequired,
  addBusiness: PropTypes.func.isRequired
};

const mapStateToProps = state => {
  return {
    isAuthenticated: state.myauth.isAuthenticated,
    auth_info: state.myauth.auth_info,
    successAddBusiness: state.mybusiness.success_add_business
  };
};

export default connect(
  mapStateToProps,
  { loadUser, addBusiness }
)(BusinessCreate);
