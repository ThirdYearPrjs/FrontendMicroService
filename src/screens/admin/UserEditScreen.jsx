import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Form, Button } from 'react-bootstrap';
import Message from '../../components/Message';
import Loader from '../../components/Loader';
import FormContainer from '../../components/FormContainer';
import { toast } from 'react-toastify';
import {
    useUpdateUserMutation,
    useGetUserDetailsQuery
} from '../../slices/usersApiSlice';

const UserEditScreen = () => {
    const { id: userId } = useParams();
    const navigate = useNavigate();

    // Form State
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [enabled, setEnabled] = useState(false);
    const [roles, setRoles] = useState({
        isAdmin: false,
        isSalesperson: false,
        isEditor: false,
        isShipper: false,
        isAssistant: false
    });

    // Queries & Mutations
    const { data: user, isLoading, error } = useGetUserDetailsQuery(userId);
    const [updateUser, { isLoading: loadingUpdate }] = useUpdateUserMutation();

    // Helper: Convert state checkboxes back to the List<Role> format the backend expects
    const formatRoles = (rolesState) => {
        const roleMapping = [
            { key: 'isAdmin', name: 'Admin' },
            { key: 'isSalesperson', name: 'Salesperson' },
            { key: 'isEditor', name: 'Editor' },
            { key: 'isShipper', name: 'Shipper' },
            { key: 'isAssistant', name: 'Assistant' },
        ];

        return roleMapping
            .filter(role => rolesState[role.key])
            .map(role => ({ name: role.name }));
    };

    useEffect(() => {
        if (user) {
            setFirstName(user.firstName || '');
            setLastName(user.lastName || '');
            setEmail(user.email || '');
            setEnabled(user.enabled || false);

            // Map incoming roles array to checkbox state
            const userRoles = user.roles || [];
            setRoles({
                isAdmin: userRoles.some(r => r.name === 'Admin'),
                isSalesperson: userRoles.some(r => r.name === 'Salesperson'),
                isEditor: userRoles.some(r => r.name === 'Editor'),
                isShipper: userRoles.some(r => r.name === 'Shipper'),
                isAssistant: userRoles.some(r => r.name === 'Assistant')
            });
        }
    }, [user]);

    const submitHandler = async (e) => {
        e.preventDefault();
        if (!userId) {
            toast.error("User ID is missing. Cannot update.");
            return;
        }
        try {
            await updateUser({
                id: userId,
                firstName,
                lastName,
                email,
                enabled,
                roles: formatRoles(roles),
                photo: user?.photo
            }).unwrap();

            toast.success('User updated successfully');
            navigate('/admin/userlist');
        } catch (err) {
            toast.error(err?.data?.message || err.error || 'Update failed');
        }
    };

    return (
        <>
            <Link to='/admin/userlist' className='btn btn-light my-3'>
                Go Back
            </Link>
            <FormContainer>
                <h1>Edit User</h1>
                {loadingUpdate && <Loader />}
                {isLoading ? (
                    <Loader />
                ) : error ? (
                    <Message variant='danger'>
                        {error?.data?.message || error.error || 'Failed to load user'}
                    </Message>
                ) : (
                    <Form onSubmit={submitHandler}>
                        <Form.Group controlId='firstName' className='my-2'>
                            <Form.Label>First Name</Form.Label>
                            <Form.Control
                                type='text'
                                placeholder='Enter first name'
                                value={firstName}
                                onChange={(e) => setFirstName(e.target.value)}
                            />
                        </Form.Group>

                        <Form.Group controlId='lastName' className='my-2'>
                            <Form.Label>Last Name</Form.Label>
                            <Form.Control
                                type='text'
                                placeholder='Enter last name'
                                value={lastName}
                                onChange={(e) => setLastName(e.target.value)}
                            />
                        </Form.Group>

                        <Form.Group controlId='email' className='my-2'>
                            <Form.Label>Email Address</Form.Label>
                            <Form.Control
                                type='email'
                                placeholder='Enter email'
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </Form.Group>

                        <h5 className="mt-4">Roles</h5>
                        <Form.Group controlId='isAdmin' className='my-2'>
                            <Form.Check
                                type='checkbox'
                                label='Admin'
                                checked={roles.isAdmin}
                                onChange={(e) => setRoles({ ...roles, isAdmin: e.target.checked })}
                            />
                        </Form.Group>

                        <Form.Group controlId='isSalesperson' className='my-2'>
                            <Form.Check
                                type='checkbox'
                                label='Salesperson'
                                checked={roles.isSalesperson}
                                onChange={(e) => setRoles({ ...roles, isSalesperson: e.target.checked })}
                            />
                        </Form.Group>

                        <Form.Group controlId='isEditor' className='my-2'>
                            <Form.Check
                                type='checkbox'
                                label='Editor'
                                checked={roles.isEditor}
                                onChange={(e) => setRoles({ ...roles, isEditor: e.target.checked })}
                            />
                        </Form.Group>

                        <Form.Group controlId='isShipper' className='my-2'>
                            <Form.Check
                                type='checkbox'
                                label='Shipper'
                                checked={roles.isShipper}
                                onChange={(e) => setRoles({ ...roles, isShipper: e.target.checked })}
                            />
                        </Form.Group>

                        <Form.Group controlId='isAssistant' className='my-2'>
                            <Form.Check
                                type='checkbox'
                                label='Assistant'
                                checked={roles.isAssistant}
                                onChange={(e) => setRoles({ ...roles, isAssistant: e.target.checked })}
                            />
                        </Form.Group>

                        <Form.Group controlId='enabled' className='my-4'>
                            <Form.Check
                                type='checkbox'
                                label='User Enabled'
                                checked={enabled}
                                onChange={(e) => setEnabled(e.target.checked)}
                            />
                        </Form.Group>

                        <Button type='submit' variant='primary' className='my-2'>
                            Update User
                        </Button>
                    </Form>
                )}
            </FormContainer>
        </>
    );
};

export default UserEditScreen;