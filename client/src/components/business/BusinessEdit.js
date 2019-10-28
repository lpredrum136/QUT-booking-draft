import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { loadUser } from '../../actions/authActions';
import { getOneBusiness, editBusiness } from '../../actions/businessActions';
import { connect } from 'react-redux';
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

class BusinessEdit extends Component {
  state = {
    id: this.props.match.params.id,
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

  static propTypes = {
    loadUser: PropTypes.func.isRequired,
    getOneBusiness: PropTypes.func.isRequired,
    editBusiness: PropTypes.func.isRequired,
    isAuthenticated: PropTypes.bool,
    auth_info: PropTypes.object.isRequired,
    my_businesses: PropTypes.array.isRequired,
    successEditBusiness: PropTypes.bool.isRequired
  };

  componentDidMount() {
    this.props.loadUser();
    this.props.getOneBusiness(this.props.match.params.id);
  }

  componentDidUpdate(prevProps) {
    const one_business = this.props.my_businesses[0];
    if (one_business && one_business !== prevProps.my_businesses[0])
      this.setState({
        name: one_business.name,
        address: one_business.address,
        phone: one_business.phone,
        desc: one_business.desc,
        website: one_business.website,
        startTime: one_business.startTime,
        endTime: one_business.endTime,
        defaultHour: one_business.defaultHour,
        defaultMin: one_business.defaultMin,
        minlead: one_business.minLead,
        maxlead: one_business.maxLead
      });
  }

  onChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };

  onSubmit = event => {
    event.preventDefault();

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

    this.props.editBusiness(new_business_data, this.state.id);

    //this.setState({ redirectToListBusiness: true });
  };

  render() {
    return (
      <div>
        {this.props.successEditBusiness && <Redirect to='/business/list' />}
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
                      value={this.state.name}
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
                      value={this.state.address}
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
                      value={this.state.phone}
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
                      value={this.state.desc}
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
                      value={this.state.website}
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
                        value={this.state.startTime}
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
                        value={this.state.endTime}
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
                        value={this.state.defaultHour}
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
                        value={this.state.defaultMin}
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
                      Minimum lead time for bookings and cancellations (in
                      hours)
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
                        value={this.state.minlead}
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
                        value={this.state.maxlead}
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

const mapStateToProps = state => {
  return {
    isAuthenticated: state.myauth.isAuthenticated,
    auth_info: state.myauth.auth_info,
    my_businesses: state.mybusiness.businesses,
    successEditBusiness: state.mybusiness.success_edit_business
  };
};

export default connect(
  mapStateToProps,
  { loadUser, getOneBusiness, editBusiness }
)(BusinessEdit);
