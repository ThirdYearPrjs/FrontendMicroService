import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Form, Button, Row, Col } from 'react-bootstrap';
import FormContainer from '../components/FormContainer';
import axios from 'axios';
import { COUNTRIES_URL, BASE_URL, STATES_URL, CUSTOMERS_URL } from '../constants';
import { toast } from 'react-toastify'
import { useRegisterMutation } from '../slices/usersApiSlice';
import { setCredentials } from '../slices/authSlice'
import { useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

function RegisterScreen() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [addressLine1, setAddressLine1] = useState('');
    const [addressLine2, setAddressLine2] = useState('');
    const [city, setCity] = useState('');
    const [state, setState] = useState('');
    const [postalCode, setPostalCode] = useState('');
    const [verificationCode, setVerificationCode] = useState('');
    const [countries, setCountries] = useState([]);
    const [states, setStates] = useState([]);
    const [selectedCountry, setSelectedCountry] = useState('');
    const [country, setCountry] = useState({ id: 1 });
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [register, { isLoading }] = useRegisterMutation();
    const { userInfo } = useSelector(state => state.auth);
    const { search } = useLocation()
    const sp = new URLSearchParams(search);
    const redirect = sp.get('redirect') || '/login';
    useEffect(() => {
        if (userInfo) {
            navigate(redirect)
        }
    }, [userInfo, redirect, navigate])
    useEffect(() => {
        // Fetch countries when component mounts
        const fetchCountries = async () => {
            const { data } = await axios.get(BASE_URL + COUNTRIES_URL); // Replace with your API endpoint
            console.log(data)
            setCountries(data);
            // console.log(countries)
        };
        fetchCountries();
    }, []);
    useEffect(() => {
        const fetchStates = async () => {
            if (country) {
                try {
                    const { data } = await axios.get(BASE_URL + STATES_URL
                        + `/states/country/${country.id}`);
                    if (Array.isArray(data)) {
                        setStates(data);
                        console.log(data);
                    } else {
                        console.error('Data received from /api/countries/:id/states is not an array:',
                            data);
                    }
                } catch (error) {
                    console.error('Error fetching states:', error);
                }
            }
        };
        fetchStates();
    }, [country]);
    const submitHandler = async (e) => {
        e.preventDefault();
        try {
            // const country = {"id": 1}
            // setCountry(country1);
            console.log({
                email, password, firstName, lastName, phoneNumber, addressLine1,
                addressLine2, city, state, country, postalCode
            });

            const res = await register({
                email, password, firstName, lastName, phoneNumber,
                addressLine1, addressLine2, city, state, country, postalCode
            }).unwrap();
            // dispatch(setCredentials({...res}));
            // console.log("hiiiiiiiiiiihii")
            // navigate(redirect)
            toast.success('Registration successful! Redirecting to login...');
            navigate('/login')
        }
        catch (err) {
            toast.error(err?.data?.message || err.error);
        }
    };
    return (
        <FormContainer>
            <h1>Sign Up</h1>
            <Form onSubmit={submitHandler}>
                <Form.Group controlId='firstName'>
                    <Form.Label>First Name</Form.Label>
                    <Form.Control type='text' placeholder='Enter first name'
                        value={firstName} onChange={(e) => setFirstName(e.target.value)}></Form.Control>
                </Form.Group>
                <Form.Group controlId='lastName'>
                    <Form.Label>Last Name</Form.Label>
                    <Form.Control type='text' placeholder='Enter last name' value={lastName}
                        onChange={(e) => setLastName(e.target.value)}></Form.Control>
                </Form.Group>
                <Form.Group controlId='email'>
                    <Form.Label>Email Address</Form.Label>
                    <Form.Control type='email' placeholder='Enter email' value={email}
                        onChange={(e) => setEmail(e.target.value)}></Form.Control>
                </Form.Group>
                <Form.Group controlId='password'>
                    <Form.Label>Password</Form.Label>
                    <Form.Control type='password' placeholder='Enter password'
                        value={password} onChange={(e) => setPassword(e.target.value)}></Form.Control>
                </Form.Group>
                <Form.Group controlId='phoneNumber'>
                    <Form.Label>Phone Number</Form.Label>
                    <Form.Control type='text' placeholder='Enter phone number'
                        value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)}></Form.Control>
                </Form.Group>
                <Form.Group controlId='addressLine1'>
                    <Form.Label>Address Line 1</Form.Label>
                    <Form.Control type='text' placeholder='Enter address line 1'
                        value={addressLine1} onChange={(e) => setAddressLine1(e.target.value)}></Form.Control>
                </Form.Group>
                <Form.Group controlId='addressLine2'>
                    <Form.Label>Address Line 2</Form.Label>
                    <Form.Control type='text' placeholder='Enter address line 2'
                        value={addressLine2} onChange={(e) => setAddressLine2(e.target.value)}></Form.Control>
                </Form.Group>
                <Form.Group controlId='city'>
                    <Form.Label>City</Form.Label>
                    <Form.Control type='text' placeholder='Enter city' value={city}
                        onChange={(e) => setCity(e.target.value)}></Form.Control>
                </Form.Group>
                <Form.Group controlId='country'>
                    <Form.Label>Country</Form.Label>
                    <Form.Control
                        as='select'
                        value={country.id}
                        onChange={(e) => {
                            const selectedCountry = countries.find(c => c.id === e.target.value);
                            setCountry(selectedCountry);
                        }}
                    >
                        <option value=''>Select Country</option>
                        {Array.isArray(countries) && countries.map((country) => (
                            <option key={country.id} value={country.id}>
                                {country.name}
                            </option>
                        ))}
                    </Form.Control>
                </Form.Group>
                <Form.Group controlId='state'>
                    <Form.Label>State</Form.Label>
                    <Form.Control as='select' value={state} onChange={(e) => setState(e.target.value)}>
                        <option value=''>Select State</option>
                        {Array.isArray(states) && states.map((state) => (
                            <option key={state.id} value={state.name}>
                                {state.name}
                            </option>
                        ))}
                    </Form.Control>
                </Form.Group>
                <Form.Group controlId='postalCode'>
                    <Form.Label>Postal Code</Form.Label>
                    <Form.Control type='text' placeholder='Enter postal code'
                        value={postalCode} onChange={(e) => setPostalCode(e.target.value)}></Form.Control>
                </Form.Group>
                <Button type='submit' variant='primary' className='mt-2'>
                    Sign Up
                </Button>
            </Form>
            <Row className='py-3'>
                <Col>
                    Have an Account? <Link to={'/login'}>Login</Link>
                </Col>
            </Row>
        </FormContainer>
    );
}
export default RegisterScreen;
