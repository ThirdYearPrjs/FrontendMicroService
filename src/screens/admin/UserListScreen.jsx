import React, { useState } from 'react';
import { LinkContainer } from 'react-router-bootstrap';
import { Table, Button, Modal, Form, Row, Col } from 'react-bootstrap';
import { FaTimes, FaTrash, FaEdit, FaCheck, FaUserPlus } from 'react-icons/fa';
import Loader from '../../components/Loader';
import Message from '../../components/Message';
import { toast } from 'react-toastify';
import {
    useGetUserQuery,
    useDeleteUserMutation,
    useRegisterUserMutation
} from '../../slices/usersApiSlice';

function UserListScreen() {
    const { data: users, refetch, error, isLoading } = useGetUserQuery();
    const [deleteUser, { isLoading: loadingDelete }] = useDeleteUserMutation();
    const [registerUser, { isLoading: loadingRegister }] = useRegisterUserMutation();

    // Form State
    const [email, setEmail] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [password, setPassword] = useState('');
    const [roles, setRoles] = useState([]);
    const [show, setShow] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);

    const availableRoles = [
        { id: 1, name: 'Admin' },
        { id: 4, name: 'Shipper' },
        { id: 3, name: 'Editor' },
        { id: 5, name: 'Assistant' },
        { id: 2, name: 'Salesperson' },
    ];

    const handleClose = () => {
        setShow(false);
        resetForm();
    };

    const handleShow = () => setShow(true);

    const resetForm = () => {
        setEmail('');
        setFirstName('');
        setLastName('');
        setPassword('');
        setRoles([]);
        setSelectedFile(null);
    };

    const deleteHandler = async (id) => {
        if (window.confirm('Are you sure you want to delete this user?')) {
            try {
                await deleteUser(id).unwrap();
                refetch();
                toast.success('User deleted successfully');
            } catch (err) {
                toast.error(err?.data?.message || err.error || 'Failed to delete user');
            }
        }
    };

    const handleRoleChange = (role, isChecked) => {
        if (isChecked) {
            setRoles([...roles, role]);
        } else {
            setRoles(roles.filter((r) => r.id !== role.id));
        }
    };

    const submitHandler = async (e) => {
        e.preventDefault();

        try {
            const formData = new FormData();
            formData.append('firstName', firstName);
            formData.append('lastName', lastName);
            formData.append('email', email);
            formData.append('password', password);
            formData.append('roles', JSON.stringify(roles));

            if (selectedFile) {
                formData.append('photo', selectedFile);
            }

            await registerUser(formData).unwrap();

            toast.success('User created successfully');
            handleClose();
            refetch();
        } catch (err) {
            toast.error(err?.data?.message || err.error || 'Failed to create user');
        }
    };

    const handlePhotoUpload = (event) => {
        const file = event.target.files[0];
        if (file) {
            setSelectedFile(file);
        }
    };

    return (
        <>
            <Row className='align-items-center'>
                <Col>
                    <h1>Users</h1>
                </Col>
                <Col className='text-end'>
                    <Button className='my-3' onClick={handleShow}>
                        <FaUserPlus /> Add User
                    </Button>
                </Col>
            </Row>

            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Add User</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form id="user-form" onSubmit={submitHandler}>
                        <Form.Group className="mb-3">
                            <Form.Label>Email</Form.Label>
                            <Form.Control
                                type="email"
                                placeholder='Enter email'
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>First Name</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder='Enter first name'
                                value={firstName}
                                onChange={(e) => setFirstName(e.target.value)}
                                required
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Last Name</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder='Enter last name'
                                value={lastName}
                                onChange={(e) => setLastName(e.target.value)}
                                required
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Password</Form.Label>
                            <Form.Control
                                type="password"
                                placeholder='Enter password'
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Roles</Form.Label>
                            <Row>
                                <Col>
                                    {availableRoles.map(role => (
                                        <Form.Check
                                            key={role.id}
                                            type="checkbox"
                                            label={role.name}
                                            checked={roles.some(r => r.id === role.id)}
                                            onChange={(e) => handleRoleChange(role, e.target.checked)}
                                        />
                                    ))}
                                </Col>
                            </Row>
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Photo</Form.Label>
                            <Form.Control
                                type="file"
                                accept="image/*"
                                onChange={handlePhotoUpload}
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                    <Button
                        variant="primary"
                        type="submit"
                        form="user-form"
                        disabled={loadingRegister}
                    >
                        {loadingRegister ? 'Saving...' : 'Save Changes'}
                    </Button>
                </Modal.Footer>
            </Modal>

            {loadingDelete && <Loader />}

            {isLoading ? (
                <Loader />
            ) : error ? (
                <Message variant='danger'>
                    {error?.data?.message || error?.error || 'An unexpected error occurred'}
                </Message>
            ) : (
                <Table striped bordered hover responsive className='table-sm'>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>NAME</th>
                            <th>EMAIL</th>
                            <th>ADMIN</th>
                            <th>SALESPERSON</th>
                            <th>EDITOR</th>
                            <th>SHIPPER</th>
                            <th>ASSISTANT</th>
                            <th>ENABLED</th>
                            <th>ACTIONS</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users && users.map(user => (
                            <tr key={user.id}>
                                <td>{user.id}</td>
                                <td>{`${user.firstName} ${user.lastName}`}</td>
                                <td>
                                    <a href={`mailto:${user.email}`}>{user.email}</a>
                                </td>
                                <td>
                                    {user.roles?.some(r => r.name === 'Admin') ?
                                        <FaCheck color='green' /> : <FaTimes color='red' />}
                                </td>
                                <td>
                                    {user.roles?.some(r => r.name === 'Salesperson') ?
                                        <FaCheck color='green' /> : <FaTimes color='red' />}
                                </td>
                                <td>
                                    {user.roles?.some(r => r.name === 'Editor') ?
                                        <FaCheck color='green' /> : <FaTimes color='red' />}
                                </td>
                                <td>
                                    {user.roles?.some(r => r.name === 'Shipper') ?
                                        <FaCheck color='green' /> : <FaTimes color='red' />}
                                </td>
                                <td>
                                    {user.roles?.some(r => r.name === 'Assistant') ?
                                        <FaCheck color='green' /> : <FaTimes color='red' />}
                                </td>
                                <td>
                                    {user.enabled ? <FaCheck color='green' /> : <FaTimes color='red' />}
                                </td>
                                <td>
                                    <LinkContainer to={`/admin/user/${user.id}/edit`}>
                                        <Button variant='light' className='btn-sm me-2'>
                                            <FaEdit />
                                        </Button>
                                    </LinkContainer>
                                    <Button
                                        variant='danger'
                                        className='btn-sm'
                                        onClick={() => deleteHandler(user.id)}
                                    >
                                        <FaTrash />
                                    </Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            )}
        </>
    );
}

export default UserListScreen;