import React, { useEffect, useState } from 'react';
import { Table, Space, Modal, Input, Form, Select, notification } from 'antd';
import axios from 'axios';

const { Option } = Select;

const ManageUser = () => {
    const [data, setData] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);


    const showModal = (user) => {
        setSelectedUser(user);
        setIsModalOpen(true);
    };

    const showDeleteModal = (user) => {
        setSelectedUser(user);
        setIsDeleteModalOpen(true);
    };

    const handleOk = async () => {
        setIsModalOpen(false);
        await updateUser(selectedUser);
        setSelectedUser(null);
    };

    const handleDeleteOk = async () => {
        setIsDeleteModalOpen(false);
        await deleteUser(selectedUser);
    };

    const handleCancel = () => {
        setIsModalOpen(false);
        setIsDeleteModalOpen(false);
        setSelectedUser(null);
    };

    const getAllUsers = async () => {
        try {
            const configHeader = {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
                },
            };
            const response = await axios.get('http://localhost:8080/user/all', configHeader);
            setData(response.data);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    const updateUser = async (user) => {
        try {
            const configHeader = {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
                },
            };
            await axios.put(`http://localhost:8080/user/${user.id}`, user, configHeader);
            await getAllUsers();
        } catch (error) {
            console.error('Error updating user:', error);
        }
    };

    const deleteUser = async (user) => {
        try {
            const configHeader = {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
                },
            };
            await axios.delete(`http://localhost:8080/user/${user.id}`, configHeader);
            await getAllUsers();
            notification.success({
                message: 'User deleted successfully',
            });
        } catch (error) {
            console.error('Error deleting user:', error);
            notification.error({
                message: 'Error deleting user',
            });
        }
    };

    useEffect(() => {
        getAllUsers();
    }, []);

    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
        },
        {
            title: 'Username',
            dataIndex: 'username',
        },
        {
            title: 'Email',
            dataIndex: 'email',
        },
        {
            title: 'Name',
            dataIndex: 'name',
        },
        {
            title: 'Role',
            dataIndex: 'role',
        },
        {
            title: 'Action',
            key: 'action',
            render: (text, record) => (
                <Space size="middle">
                    <a onClick={() => showModal(record)}>Edit</a>
                    <a style={{ color: 'red' }} onClick={() => showDeleteModal(record)}>
                        Delete
                    </a>
                </Space>
            ),
        },
    ];

    return (
        <>
            <Table columns={columns} dataSource={data} />
            {selectedUser && (
                <Modal
                    title="Edit User"
                    visible={isModalOpen}
                    onOk={handleOk}
                    onCancel={handleCancel}
                >
                    {/* Display the details of the selected user in the modal */}
                    <Form>
                        <Form.Item label="Name" name="name">
                            <Input
                                defaultValue={selectedUser.name}
                                value={selectedUser.name}
                                onChange={(e) =>
                                    setSelectedUser((prevUser) => ({
                                        ...prevUser,
                                        name: e.target.value,
                                    }))
                                }
                            />
                        </Form.Item>
                        <Form.Item label="Email" name="email">
                            <Input
                                defaultValue={selectedUser.email}
                                value={selectedUser.email}
                                onChange={(e) =>
                                    setSelectedUser((prevUser) => ({
                                        ...prevUser,
                                        email: e.target.value,
                                    }))
                                }

                            />
                        </Form.Item>
                        <Form.Item label="Role" name="role">
                            <Select
                                defaultValue={selectedUser.role}
                                value={selectedUser.role}
                                onChange={(value) =>
                                    setSelectedUser((prevUser) => ({
                                        ...prevUser,
                                        role: value,
                                    }))
                                }

                                style={{ width: '150px', height: '30px' }}
                            >
                                <Option value="USER">USER</Option>
                                <Option value="ADMIN">ADMIN</Option>
                            </Select>
                        </Form.Item>
                        {/* Add other form fields for user details */}
                    </Form>
                </Modal>
            )}

            {selectedUser && (
                <Modal
                    title="Confirm Delete"
                    visible={isDeleteModalOpen}
                    onOk={handleDeleteOk}
                    onCancel={handleCancel}
                >
                    <p>Are you sure you want to delete this user?</p>
                </Modal>
            )}
        </>
    );
};

export default ManageUser;
