import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {Button, Modal, notification, Space, Table, Spin} from 'antd';
import { Link } from 'react-router-dom';

const ViewFile = () => {
    const [hdrFile, setHdrFile] = useState(null);
    const [imgFile, setImgFile] = useState(null);
    const [tifFile, setTifFile] = useState(null);
    const [data, setData] = useState([]);
    const [selectedData, setSelectedData] = useState(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isAddHyperImageModalVisible, setAddHyperImageModalVisible] = useState(false);
    const [isAddMultiImageModalVisible, setAddMultiImageModalVisible] = useState(false);
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

    const loadingOverlaySpinStyle = {
        fontSize: '36px', // Larger spinner size
    };

    const showDeleteModal = (selectedItem) => {
        setSelectedData(selectedItem);
        setIsDeleteModalOpen(true);
    };

    const handleDeleteOk = async () => {
        setIsDeleteModalOpen(false);
        await deleteImageFile(selectedData);
    };

    const handleCancel = () => {
        setIsDeleteModalOpen(false);
        setAddHyperImageModalVisible(false);
        setAddMultiImageModalVisible(false);
        setSelectedData(null);
    };

    const showHyperModal = () => {
        setAddHyperImageModalVisible(true);
    };

    const showMultiModal = () => {
        setAddMultiImageModalVisible(true);
    };

    const handleAddHyperImageOk = async () => {
        setIsUploading(true);
        setAddHyperImageModalVisible(false);

        try {
            await handleHyperImage();
        } finally {
            setIsUploading(false);
        }
    };

    const handleAddMultiImageOk = async () => {
        setIsUploading(true);
        setAddMultiImageModalVisible(false);

        try {
            await handleMultiImage();
        } finally {
            setIsUploading(false);
        }
    };

    const handleHyperChange = (event) => {
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
            notification.error({
                message: 'Error',
                description: 'Unsupported file type. Please choose an HDR (.hdr) or IMG (.img) file.',
            });
        }
    };

    const handleMultiChange = (event) => {
        const file = event.target.files[0];

        if (!file) {
            return;
        }

        const fileType = file.name.split('.').pop().toLowerCase();

        if (fileType === 'tif') {
            setTifFile(file);
        } else {
            notification.error({
                message: 'Error',
                description: 'Unsupported file type. Please choose a TIF (.tif) file.',
            });
        }
    };

    const handleHyperImage = async () => {
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

            await axios.post('http://localhost:8080/image/hyper', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
                    UserId: localStorage.getItem('userId'),
                },
            });

            notification.success({
                message: 'Success',
                description: 'Files uploaded successfully.',
            });

            await fetchImageFile();
        } catch (error) {
            console.error('Error uploading files:', error.response?.data || error.message);

            notification.error({
                message: 'Error',
                description: 'Failed to upload files. Please try again.',
            });
        } finally {
            setIsUploading(false);
        }
    };

    const handleMultiImage = async () => {
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

            await axios.post('http://localhost:8080/image/multi', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
                    UserId: localStorage.getItem('userId'),
                },
            });

            notification.success({
                message: 'Success',
                description: 'Files uploaded successfully.',
            });

            await fetchImageFile();
        } catch (error) {
            console.error('Error uploading files:', error.response?.data || error.message);

            notification.error({
                message: 'Error',
                description: 'Failed to upload files. Please try again.',
            });
        } finally {
            setIsUploading(false);
        }
    };

    const deleteImageFile = async (selectedItem) => {
        try {
            const configHeader = {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
                },
            };
            await axios.delete(`http://localhost:8080/image/${selectedItem.id}`, configHeader);
            await fetchImageFile();
            notification.success({
                message: 'Data deleted successfully',
            });
        } catch (error) {
            console.error('Error deleting file:', error);
            notification.error({
                message: 'Error deleting file',
            });
        }
    };

    const fetchImageFile = async () => {
        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
                    UserId: localStorage.getItem('userId'),
                },
            };

            const response = await axios.get(`http://localhost:8080/image/${localStorage.getItem('userId')}`, config);
            setData(response.data);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    useEffect(() => {
        fetchImageFile();
    }, []);

    const columns = [
        {
            title: 'File',
            // width: 100,
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
            // width: 120,
        },
        {
            title: 'Action',
            fixed: 'right',
            // width: 100,
            render: (text, record) => (
                <Space size="middle">
                    <Button type="link" danger onClick={() => showDeleteModal(record)}>
                        Delete
                    </Button>
                    {/*{record.type === 'header' && (*/}
                    {/*    <Link to={`/users/image`}>*/}
                    {/*        <a style={{ color: 'blue' }} onClick={() => viewImage(record)}>*/}
                    {/*            View*/}
                    {/*        </a>*/}
                    {/*    </Link>*/}
                    {/*)}*/}
                </Space>
            ),
        },
    ];

    return (
        <>
            <div style={{marginBottom: '16px'}}>
                <Button onClick={showHyperModal} type="primary">
                    Upload Hyperspectral Image
                </Button>

                <Button style={{marginLeft: '10px'}} onClick={showMultiModal} type="primary">
                    Upload Multispectral Image
                </Button>
            </div>

            <Table columns={columns} dataSource={data}/>

            {isUploading && (
                <div style={loadingOverlayStyle}>
                    <Spin tip="Uploading..." style={loadingOverlaySpinStyle} />
                </div>
            )}

            {selectedData && (
                <Modal
                    title="Confirm Delete"
                    open={isDeleteModalOpen}
                    onOk={handleDeleteOk}
                    onCancel={handleCancel}
                >
                    <p>Are you sure you want to delete this file?</p>
                </Modal>
            )}

            <Modal
                title="Upload Hyperspectral Image"
                open={isAddHyperImageModalVisible}
                onOk={handleAddHyperImageOk}
                onCancel={handleCancel}
            >
                <p>HDR file</p>
                <input type="file" accept=".hdr" onChange={handleHyperChange}/>
                <p>IMG file</p>
                <input type="file" accept=".img" onChange={handleHyperChange}/>
            </Modal>

            <Modal
                title="Upload Multispectral Image"
                open={isAddMultiImageModalVisible}
                onOk={handleAddMultiImageOk}
                onCancel={handleCancel}
            >
                <p>TIF file</p>
                <input type="file" accept=".tif" onChange={handleMultiChange}/>
            </Modal>
        </>
    );
};

export default ViewFile;
