import React, {useEffect, useState} from "react";
import {Button, Form, InputNumber, notification, Select} from "antd";
import axios from "axios";

const ViewImage = () => {
    const [hyperHeaderIdData, setHyperHeaderIdData] = useState([]);
    const [multiHeaderIdData, setMultiHeaderIdData] = useState([]);
    const [image, setImage] = useState('');

    const fetchHeaderHyper = async () => {
        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
                },
            };
            const response = await axios.get(`http://localhost:8080/image/hyper/${localStorage.getItem('userId')}/header`, config);
            setHyperHeaderIdData(response.data);
        } catch (error) {
            console.error('Error fetching image id:', error);
        }
    }

    const fetchHeaderMulti = async () => {
        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
                },
            };
            const response = await axios.get(`http://localhost:8080/image/multi/${localStorage.getItem('userId')}`, config);
            setMultiHeaderIdData(response.data);
        } catch (error) {
            console.error('Error fetching image id:', error);
        }
    }

    const fetchHyperImage = async (values) => {
        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
                    UserId: localStorage.getItem('userId'),
                },
            };

            const response = await axios.post('http://localhost:8080/image/hyper/rgb', values, config);
            setImage(response.data);
        } catch (error) {
            console.error('Error fetching data:', error);
            notification.error(
                {
                    message: 'Error',
                    description: 'Please choose a valid image id and RGB values.'
                }
            )
        }
    };

    const fetchMultiImage = async (values) => {
        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
                    UserId: localStorage.getItem('userId'),
                },
            };

            const response = await axios.post('http://localhost:8080/image/multi/rgb', values, config);
            setImage(response.data);
        } catch (error) {
            console.error('Error fetching data:', error);
            notification.error(
                {
                    message: 'Error',
                    description: 'Please choose a valid image id and RGB values.'
                }
            )
        }
    };

    const isHyper = (values) => {
        const hyperIds = [...hyperHeaderIdData].map((item) => item.id);
        return hyperIds.includes(values);
    }


    const viewImage = (values) => {
        const addedImageData = {
            id: values.imageId,
            red: values.red,
            green: values.green,
            blue: values.blue,
        }
        if (isHyper(values.imageId)) {
            fetchHyperImage(addedImageData);
        } else {
            fetchMultiImage(addedImageData);
        }
    }


    useEffect(() => {
        fetchHeaderHyper();
        fetchHeaderMulti();
    }, []);

    const optionsHyper = [...hyperHeaderIdData].map((item) => {
        const fileName = item.path.split('/').pop();
        return {
            label: fileName,
            value: item.id,
        };
    });

    const optionsMulti = [...multiHeaderIdData].map((item) => {
        const fileName = item.path.split('/').pop();
        return {
            label: fileName,
            value: item.id,
        };
    });


    const options = [
        {
            label: 'Hyperspectral Image',
            title: 'Hyperspectral Image',
            options: [...optionsHyper]
        },
        {
            label: 'Multispectral Image',
            title: 'Multispectral Image',
            options: [...optionsMulti]
        },
    ];


    return (
        <>
            <div>
                <Form layout='inline' onFinish={viewImage}>
                    <Form.Item label="Image" name="imageId" style={{width:'40%'}} rules={[{required:true, message: 'Please choose an image!'}]}>
                        <Select options={options}/>
                    </Form.Item>

                    <Form.Item label="Red" name="red" rules={[{required:true, message:'Please choose a value'}]}>
                        <InputNumber min={0}/>
                    </Form.Item>

                    <Form.Item label="Green" name="green" rules={[{required:true, message:'Please choose a value'}]}>
                        <InputNumber min={0}/>
                    </Form.Item>

                    <Form.Item label="Blue" name="blue" rules={[{required:true, message:'Please choose a value'}]}>
                        <InputNumber min={0}/>
                    </Form.Item>

                    <Form.Item>
                        <Button type="primary" htmlType="submit">View Image</Button>
                    </Form.Item>

                </Form>

            </div>

            <div style={{justifyContent: 'center', marginTop:'10px'}}>
                <img src={image} style={{width:'100%'}}/>
            </div>


        </>
    );

};

export default ViewImage;
