import React, {useEffect, useState} from 'react';
import axios from "axios";
import {Button, Form, message, Modal, notification, Popconfirm, Space, Spin, Table} from "antd";

const ManageFile = () => {
    const [data, setData] = useState([]);
    const [form] = Form.useForm();
    const [hdrFile, setHdrFile] = useState(null);
    const [imgFile, setImgFile] = useState(null);
    const [tifFile, setTifFile] = useState(null);
    const [fetchedUsers, setFetchedUsers] = useState([]);
    const [isUploading, setIsUploading] = useState(false);

    const loadingOverlayStyle = {
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        background: 'rgba(0, 0, 0, 0.5)', // Darker background
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000,
    };

    const showLoadingOverlay = () => (
        <div style={loadingOverlayStyle}>
            <Spin tip="Uploading..." style={{fontSize: '24px'}}/>
        </div>
    );

    const fetchImageAndSetData = async (userId) => {
        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
                },
            };

            const response = await axios.get(`http://localhost:8080/image/${userId}`, config);

            // Update data with imageFiles for the specific user
            setData((prevData) =>
                prevData.map((user) => (user.id === userId ? {...user, files: response.data} : user))
            );
        } catch (error) {
            console.error('Error fetching image data:', error);
        }
    };

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const usersResponse = await axios.get('http://localhost:8080/user/all', {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
                    },
                });
                const users = usersResponse.data;

                const usersWithKeys = users.map((user, index) => ({ ...user, key: index }));

                setData(usersWithKeys);

                // Fetch image data for all users concurrently
                const fetchImagePromises = users.map((user) => fetchImageAndSetData(user.id));
                await Promise.all(fetchImagePromises);
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };

        fetchUser();
    }, []);

    useEffect(() => {
        const fetchImageForUser = async (userId) => {
            try {
                // Check if the user has associated image data
                const user = data.find((user) => user.id === userId);
                if (user && user.files) {
                    return;
                }

                // Check if image data has already been fetched for this user
                if (!fetchedUsers.includes(userId)) {
                    await fetchImageAndSetData(userId);

                    // Update the fetchedUsers state to mark this user as fetched
                    setFetchedUsers((prevUsers) => [...prevUsers, userId]);
                }
            } catch (error) {
                console.error('Error fetching image data:', error);
            }
        };

        if (data.length > 0) {
            const userId = data[1].id; // Assuming you want to fetch images for the second user
            fetchImageForUser(userId);
        }
    }, [data, fetchedUsers]);

    const deleteUserImage = async (imageId) => {
        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
                },
            };

            await axios.delete(`http://localhost:8080/image/${imageId}`, config);

            // Update data with the deleted image removed immediately
            setData((prevData) => {
                return prevData.map((user) => ({
                    ...user,
                    files: user.files ? user.files.filter((file) => file.id !== imageId) : [],
                }));
            });

            message.success('Image deleted successfully');
        } catch (error) {
            console.error('Error deleting image:', error);
            message.error('Error deleting image');
        }
    };

    const expandedRowRender = (record) => {
        const columns = [
            {
                title: 'File',
                dataIndex: 'path',
                fixed: 'left',
                render: (text) => {
                    const fileName = text.split('/').pop();
                    return <span>{fileName}</span>;
                },
            },
            {
                title: 'Type',
                dataIndex: 'type',
            },
            {
                title: 'Action',
                dataIndex: 'operation',
                render: (_, record) => (
                    <Space size="middle">
                        <Popconfirm
                            title="Are you sure to delete this file?"
                            onConfirm={() => deleteUserImage(record.id)}
                            okText="Yes"
                            cancelText="No"
                        >
                            <Button danger> Delete </Button>
                        </Popconfirm>
                    </Space>
                ),
            },
        ];

        // Check if the user has associated image data
        const imageData = record.files || [];

        return (
            <div>
                <Table columns={columns} dataSource={imageData} pagination={false}/>
                <Button type="primary" style={{marginTop: '10px'}} onClick={() => showAddHyperImageModal(record.id)}>
                    Add Hyperspectral Image
                </Button>
                <Button type="primary" style={{marginTop: '10px', marginLeft: '10px'}} onClick={() => showAddMultiImageModal(record.id)}>
                    Add Multispectral Image
                </Button>
            </div>
        );
    };

    const columns = [
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
    ];

    // Add Image Modal
    const [isAddHyperImageModalVisible, setAddHyperImageModalVisible] = useState(false);
    const [isAddMultiImageModalVisible, setAddMultiImageModalVisible] = useState(false);
    const [currentUserId, setCurrentUserId] = useState(null);

    const handleAddHyperImageCancel = () => {
        setAddHyperImageModalVisible(false);
    };

    const handleAddMultiImageCancel = () => {
        setAddMultiImageModalVisible(false);
    };

    const showAddHyperImageModal = (userId) => {
        setCurrentUserId(userId);
        setAddHyperImageModalVisible(true);
    };

    const showAddMultiImageModal = (userId) => {
        setCurrentUserId(userId);
        setAddMultiImageModalVisible(true);
    };

    const handleAddHyperImageOk = async () => {
        setAddHyperImageModalVisible(false);
        try {
            const values = await form.validateFields();
            const {hdrFile, imgFile} = values;

            // Assuming your image data structure contains 'hdr' and 'img' properties
            const hyperImageData = {hdr: hdrFile, img: imgFile};

            setIsUploading(true); // Set loading to true before starting the upload

            await addUserHyperImage(currentUserId, hyperImageData);

            // After the upload is complete, set loading to false and close the modal
            setIsUploading(false);

        } catch (error) {
            console.error('Error adding image:', error);

            // Handle error if necessary

            // Ensure loading is set to false even in case of an error
            setIsUploading(false);
        }
    };

    const handleAddMultiImageOk = async () => {
        setAddMultiImageModalVisible(false);
        try {
            const values = await form.validateFields();

            const multiImageData = {tif: values};

            setIsUploading(true); // Set loading to true before starting the upload

            await addUserMultiImage(currentUserId, multiImageData);

            // After the upload is complete, set loading to false and close the modal
            setIsUploading(false);

        } catch (error) {
            console.error('Error adding image:', error);

            // Handle error if necessary

            // Ensure loading is set to false even in case of an error
            setIsUploading(false);
        }
    };

    const handleHyperFile = (event) => {
        const file = event.target.files[0];

        if (!file) {
            return;
        }
        const fileType = file.name.split('.').pop().toLowerCase();

        if (fileType === 'hdr') {
            setHdrFile(file);
        } else if (fileType === 'img') {
            setImgFile(file);
        } else {
            // Show an error notification for unsupported file types
            notification.error({
                message: 'Error',
                description: 'Unsupported file type. Please choose an HDR (.hdr) or IMG (.img) file.',
            });
        }
    };

    const handleMultiFile = (event) => {
        const file = event.target.files[0];

        if (!file) {
            return;
        }
        const fileType = file.name.split('.').pop().toLowerCase();

        if (fileType === 'tif') {
            setTifFile(file);
        } else {
            // Show an error notification for unsupported file types
            notification.error({
                message: 'Error',
                description: 'Unsupported file type. Please choose a TIF (.tif) file.',
            });
        }
    };

    const addUserHyperImage = async (userId) => {
        try {
            if (!hdrFile || !imgFile) {
                notification.error({
                    message: 'Error',
                    description: 'Please choose both an HDR (.hdr) and an IMG (.img) file to upload.',
                });
                return;
            }

            const formData = new FormData();
            formData.append('hdr', hdrFile);
            formData.append('img', imgFile);

            const config = {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
                    UserId: userId,
                    'Content-Type': 'multipart/form-data',
                },
            };

            // Asynchronous upload
            await axios.post(`http://localhost:8080/image/hyper`, formData, config);

            // Immediately fetch and update image data for the user
            await fetchImageAndSetData(userId);

            // Update data with the added image immediately
            // setData((prevData) => {
            //     return prevData.map((user) => {
            //         if (user.id === userId) {
            //             return {
            //                 ...user,
            //                 files: [...(user.files || []), { /* Add properties for the new image */}],
            //             };
            //         }
            //         return user;
            //     });
            // });

            message.success('Hyperspectral image added successfully');
        } catch (error) {
            console.error('Error adding image:', error);
            message.error('Error adding image');
        }
    };

    const addUserMultiImage = async (userId) => {
        try {
            if (!tifFile) {
                notification.error({
                    message: 'Error',
                    description: 'Please choose a TIF (.tif) file to upload.',
                });
                return;
            }

            const formData = new FormData();
            formData.append('tif', tifFile);

            const config = {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
                    UserId: userId,
                    'Content-Type': 'multipart/form-data',
                },
            };

            // Asynchronous upload
            await axios.post(`http://localhost:8080/image/multi`, formData, config);

            // Immediately fetch and update image data for the user
            await fetchImageAndSetData(userId);

            // Update data with the added image immediately
            // setData((prevData) => {
            //     return prevData.map((user) => {
            //         if (user.id === userId) {
            //             return {
            //                 ...user,
            //                 files: [...(user.files || []), { /* Add properties for the new image */}],
            //             };
            //         }
            //         return user;
            //     });
            // });

            message.success('Multispectral image added successfully');
        } catch (error) {
            console.error('Error adding image:', error);
            message.error('Error adding image');
        }
    };

    return (
        <>
            {isUploading && showLoadingOverlay()}

            <Table
                columns={columns}
                expandable={{
                    expandedRowRender,
                    rowExpandable: record => record.role !== 'ADMIN'
                }}
                dataSource={data}
            />
            <Modal
                title="Add hyperspectral image"
                open={isAddHyperImageModalVisible}
                onOk={handleAddHyperImageOk}
                onCancel={handleAddHyperImageCancel}
            >
                <p>HDR file</p>
                {/* Choose HDR file input */}
                <input type="file" accept=".hdr" onChange={handleHyperFile}/>
                <p>IMG file</p>
                {/* Choose IMG file input */}
                <input type="file" accept=".img" onChange={handleHyperFile}/>
            </Modal>

            <Modal
                title="Add multispectral image"
                open={isAddMultiImageModalVisible}
                onOk={handleAddMultiImageOk}
                onCancel={handleAddMultiImageCancel}
            >
                <p>TIF file</p>
                <input type="file" accept=".tif" onChange={handleMultiFile}/>
            </Modal>

        </>
    );
};

export default ManageFile;
