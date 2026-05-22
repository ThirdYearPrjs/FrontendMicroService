import React from 'react'
import { Navbar, Nav, Container, NavDropdown } from 'react-bootstrap';
import { FaShoppingCart, FaUser } from 'react-icons/fa';
import { LinkContainer } from 'react-router-bootstrap';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';

import { useLogoutMutation, useGetUserQuery } from '../slices/usersApiSlice';
import { logout } from '../slices/authSlice';

import logo from '../assets/logo.jpeg';

function Header() {
    const { userInfo } = useSelector(state => state.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [logoutApiCall] = useLogoutMutation();

    const { data: users } = useGetUserQuery();

    const logoutHandler = async () => {
        try {
            await logoutApiCall().unwrap();
            dispatch(logout());
            navigate('/login');

        } catch (err) {
            console.log(err);
        }
    };

    return (
        <header>
            <Navbar bg="dark" variant="dark" expand="lg" collapseOnSelect>
                <Container>
                    <LinkContainer to='/'>
                        <Navbar.Brand href="/">
                            <img src={logo} alt='ShopMe' width='80' height='80' style={{
                                borderRadius:
                                    '50%', marginRight: '10px'
                            }} />
                            ShopmeApp
                        </Navbar.Brand>
                    </LinkContainer>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="ms-auto">
                            <LinkContainer to='/cart'>

                                <Nav.Link href="/cart">
                                    <FaShoppingCart /> Cart
                                </Nav.Link>
                            </LinkContainer>
                            {userInfo ? (
                                <NavDropdown title={userInfo.user.username} id='username'>
                                    <LinkContainer to='/profile'>
                                        <NavDropdown.Item>Profile</NavDropdown.Item>
                                    </LinkContainer>
                                    <NavDropdown.Item
                                        onClick={logoutHandler}
                                    >Logout</NavDropdown.Item>
                                </NavDropdown>
                            ) : (
                                <LinkContainer to='/login'>
                                    <Nav.Link>
                                        <FaUser /> Sign In
                                    </Nav.Link>
                                </LinkContainer>
                            )}
                            {
                                userInfo && userInfo.user.authorities.some(auth =>
                                    auth.authority === 'Admin') && (
                                    <NavDropdown title='Admin' id='adminmenu'>
                                        <LinkContainer to='/admin/productlist'>
                                            <NavDropdown.Item>Products</NavDropdown.Item>
                                        </LinkContainer>
                                        <LinkContainer to='/admin/userlist'>
                                            <NavDropdown.Item>Users</NavDropdown.Item>
                                        </LinkContainer>
                                        <LinkContainer to='/admin/orderlist'>
                                            <NavDropdown.Item>Orders</NavDropdown.Item>
                                        </LinkContainer>
                                    </NavDropdown>
                                )
                            }
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
        </header>
    )
}
export default Header;