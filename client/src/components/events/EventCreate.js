import React, { Component, Fragment } from 'react';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import {
  clientGetBusinesses,
  getFreeSlots,
  sendBooking
} from '../../actions/eventActions';
import classnames from 'classnames';
import moment from 'moment';
import {
  CustomInput,
  Container,
  Label,
  TabContent,
  TabPane,
  Nav,
  NavItem,
  NavLink,
  Button,
  Table,
  Modal,
  ModalHeader,
  ModalBody,
  Form,
  FormGroup,
  Input,
  Card,
  CardHeader,
  CardBody,
  CardTitle,
  CardText,
  CardFooter
} from 'reactstrap';

class EventCreate extends Component {
  state = {
    services: '',
    activeTab: '',
    ranges: [],
    modal: false,
    business_chosen: '',
    subject: '',
    message: '',
    email: '',
    time_chosen: '',
    name: ''
  };

  toggleModal = time_chosen => {
    this.setState({ modal: !this.state.modal });
    this.setState({ time_chosen: time_chosen });
  };

  toggle = tab => {
    if (this.state.activeTab !== tab) this.setState({ activeTab: tab });
  };

  componentDidMount() {
    const email = this.props.match.params.email;
    this.props.clientGetBusinesses(email);
  }

  componentDidUpdate(prevProps) {
    if (
      this.props.done_get_free_slots &&
      this.props.free_days !== prevProps.free_days
    ) {
      this.setState({ activeTab: this.props.free_days[0].formatted_day });

      // Get the start and endTime of chosen business to generate table
      const business_chosen = this.props.all_businesses.filter(
        business => business.name === this.state.services
      )[0];

      // Generate time range
      if (business_chosen) {
        const start = business_chosen.startTime;
        const end = business_chosen.endTime;
        const new_start = moment(start, 'HH:mm');
        const new_end = moment(end, 'HH:mm');

        const new_start_rounded = new_start.clone().startOf('hour');

        const ranges = [];

        while (true) {
          let time_to_add = new_start_rounded.clone();
          if (!new_start_rounded.isSameOrAfter(new_end)) {
            ranges.push(time_to_add.format());
            new_start_rounded.add(1, 'h');
          } else {
            break;
          }
        }

        //console.log(ranges);
        this.setState({ ranges: ranges, business_chosen: business_chosen });
      }
    }

    if (this.props.booking_successful) console.log('yay');
  }

  onServiceChange = event => {
    this.setState({ [event.target.name]: event.target.value }, () => {
      const services_data = {
        service: this.state.services,
        email: this.props.match.params.email
      };

      this.props.getFreeSlots(services_data);
    });
  };

  onModalChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };

  onBookingSubmit = event => {
    event.preventDefault();

    // Booking data
    const booking_data = {
      subject: this.state.subject,
      message: this.state.message,
      name: this.state.name,
      client_email: this.state.email,
      business: this.state.business_chosen,
      time: this.state.time_chosen,
      owner_email: this.props.match.params.email
    };

    this.props.sendBooking(booking_data);

    // Close modal
    this.setState({ modal: !this.state.modal });
  };

  render() {
    return (
      <div>
        <Container>
          {this.props.booking_successful ? (
            <Card>
              <CardHeader tag='h3'>Booking successful</CardHeader>
              <CardBody>
                <CardTitle>
                  <strong>Booking confirmation</strong>
                </CardTitle>
                <CardText>
                  <p>
                    You have booked{' '}
                    <strong>{this.state.business_chosen.name}</strong> from{' '}
                    <strong>{this.state.business_chosen.owner}</strong>
                  </p>
                  <p>
                    On{' '}
                    <b>
                      {moment(this.state.time_chosen).format('dddd D MMM YYYY')}
                    </b>{' '}
                    at <b>{moment(this.state.time_chosen).format('h:mm a')}</b>
                  </p>
                  <p>
                    Duration:{' '}
                    <strong>
                      {this.state.business_chosen.defaultHour} hour(s){' '}
                      {this.state.business_chosen.defaultMin} minutes
                    </strong>
                  </p>
                  <p style={{ color: 'green' }}>
                    <strong>A confirmation email will be sent shortly</strong>
                  </p>
                </CardText>
              </CardBody>
              <CardFooter className='text-muted'>
                You can now close this window
              </CardFooter>
            </Card>
          ) : (
            <Fragment>
              <Label for='services'>
                <h3>Choose service</h3>
              </Label>
              <CustomInput
                type='select'
                name='services'
                id='services'
                onChange={this.onServiceChange}
                required
                defaultValue='Choose service'
              >
                <option value='Choose service' disabled>
                  Choose service
                </option>
                {this.props.all_businesses.map(business => {
                  return (
                    <option key={business._id} value={business.name}>
                      {business.name}
                    </option>
                  );
                })}
              </CustomInput>

              {this.props.done_get_free_slots && (
                <div>
                  <Nav tabs className='mt-5'>
                    {this.props.free_days.map(free_day => {
                      return (
                        <NavItem
                          key={free_day.day}
                          style={{ backgroundColor: 'grey', color: 'white' }}
                        >
                          <NavLink
                            className={classnames({
                              active:
                                this.state.activeTab ===
                                `${free_day.formatted_day}`
                            })}
                            onClick={() => {
                              this.toggle(free_day.formatted_day);
                            }}
                          >
                            <h6>
                              <b>{free_day.formatted_day}</b>
                            </h6>
                          </NavLink>
                        </NavItem>
                      );
                    })}
                  </Nav>
                  <TabContent activeTab={this.state.activeTab}>
                    {this.props.free_days.map(free_day => {
                      return (
                        <TabPane
                          key={free_day.day}
                          tabId={free_day.formatted_day}
                        >
                          <Table hover>
                            <thead>
                              <tr>
                                <th>Range</th>
                                <th>Times</th>
                              </tr>
                            </thead>
                            <tbody>
                              {this.state.ranges.map(range => {
                                return (
                                  <tr
                                    key={`${moment(free_day.day).format(
                                      'YYYY-MM-DD'
                                    )}T${moment(range).format('HH:mm:ss')}`}
                                  >
                                    <th scope='row'>
                                      {moment(range).format('h a')}
                                    </th>
                                    <td
                                      id={`${moment(free_day.day).format(
                                        'YYYY-MM-DD'
                                      )}T${moment(range).format('HH:mm:ss')}`}
                                    >
                                      {free_day.free_slots
                                        .filter(
                                          free_slot =>
                                            moment(free_slot).isBetween(
                                              `${moment(free_day.day).format(
                                                'YYYY-MM-DD'
                                              )}T${moment(range).format(
                                                'HH:mm:ss'
                                              )}`,
                                              moment(
                                                `${moment(free_day.day).format(
                                                  'YYYY-MM-DD'
                                                )}T${moment(range).format(
                                                  'HH:mm:ss'
                                                )}`
                                              ).add(1, 'h')
                                            ) ||
                                            moment(free_slot).isSame(
                                              `${moment(free_day.day).format(
                                                'YYYY-MM-DD'
                                              )}T${moment(range).format(
                                                'HH:mm:ss'
                                              )}`
                                            )
                                        )
                                        .map(free_slot => (
                                          <Button
                                            key={free_slot}
                                            color='success'
                                            className='mr-2'
                                            onClick={this.toggleModal.bind(
                                              this,
                                              moment(free_slot).format()
                                            )}
                                          >
                                            {moment(free_slot).format('h:mm a')}
                                          </Button>
                                        ))}
                                    </td>
                                  </tr>
                                );
                              })}
                            </tbody>
                          </Table>
                        </TabPane>
                      );
                    })}
                  </TabContent>
                </div>
              )}

              <Modal isOpen={this.state.modal} toggle={this.toggleModal}>
                <ModalHeader toggle={this.toggleModal}>
                  Create Booking
                </ModalHeader>
                <ModalBody>
                  <p>
                    You are booking{' '}
                    <strong>{this.state.business_chosen.name}</strong> from{' '}
                    <strong>{this.state.business_chosen.owner}</strong>
                  </p>
                  <p>
                    On{' '}
                    <b>
                      {moment(this.state.time_chosen).format('dddd D MMM YYYY')}
                    </b>{' '}
                    at <b>{moment(this.state.time_chosen).format('h:mm a')}</b>
                  </p>
                  <p>
                    Duration:{' '}
                    <strong>
                      {this.state.business_chosen.defaultHour} hour(s){' '}
                      {this.state.business_chosen.defaultMin} minutes
                    </strong>
                  </p>
                  <Form onSubmit={this.onBookingSubmit}>
                    <FormGroup>
                      <Label for='name'>Name</Label>
                      <Input
                        type='text'
                        name='name'
                        id='name'
                        onChange={this.onModalChange}
                        placeholder='Your name'
                        className='mb-3'
                        required
                      />

                      <Label for='subject'>Subject</Label>
                      <Input
                        type='text'
                        name='subject'
                        id='subject'
                        onChange={this.onModalChange}
                        placeholder='Subject'
                        className='mb-3'
                        required
                      />

                      <Label for='message'>Message</Label>
                      <Input
                        type='textarea'
                        name='message'
                        id='message'
                        placeholder='Message'
                        onChange={this.onModalChange}
                        className='mb-3'
                      />

                      <Label for='email'>Email</Label>
                      <Input
                        type='email'
                        name='email'
                        id='email'
                        placeholder='Your email'
                        onChange={this.onModalChange}
                        className='mb-3'
                        required
                      />

                      <Button
                        color='primary'
                        style={{ marginTop: '2rem' }}
                        block
                      >
                        Create Booking
                      </Button>
                    </FormGroup>
                  </Form>
                </ModalBody>
              </Modal>
            </Fragment>
          )}
        </Container>
      </div>
    );
  }
}

EventCreate.propTypes = {
  clientGetBusinesses: PropTypes.func.isRequired,
  getFreeSlots: PropTypes.func.isRequired,
  sendBooking: PropTypes.func.isRequired,
  all_businesses: PropTypes.array.isRequired,
  done_get_free_slots: PropTypes.bool.isRequired,
  free_days: PropTypes.array.isRequired,
  booking_successful: PropTypes.bool
};

const mapStateToProps = state => {
  return {
    all_businesses: state.myevent.businesses,
    done_get_free_slots: state.myevent.doneGetFreeSlots,
    free_days: state.myevent.freeDays,
    booking_successful: state.myevent.bookingSuccessful
  };
};

export default connect(
  mapStateToProps,
  { clientGetBusinesses, getFreeSlots, sendBooking }
)(EventCreate);
