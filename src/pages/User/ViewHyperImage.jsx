import React, {useEffect, useState} from "react";
import {Button, Form, InputNumber, Select} from "antd";
import axios from "axios";

const ViewHyperImage = () => {
    const [hyperHeaderIdData, setHyperHeaderIdData] = useState([]);
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

    const fetchImage = async (values) => {
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
        }
    };

    const viewImage = (values) => {
        const addedImageData = {
            id: values.imageId,
            red: values.red,
            green: values.green,
            blue: values.blue,
        }
        fetchImage(addedImageData);
    }


    useEffect(() => {
        fetchHeaderHyper();
    }, []);


    const options = [...hyperHeaderIdData].map((item) => {
        const fileName = item.path.split('/').pop();
        return {
            label: fileName,
            value: item.id,
        };
    });

    return (
        <>
            <div>
                <Form layout='inline' onFinish={viewImage}>
                    <Form.Item label="Image" name="imageId" style={{width:'50%'}} required={true}>
                        <Select options={options}/>
                    </Form.Item>

                    <Form.Item label="Red" name="red" required={true}>
                        <InputNumber min={0} max={121}/>
                    </Form.Item>

                    <Form.Item label="Green" name="green" required={true}>
                        <InputNumber min={0} max={121}/>
                    </Form.Item>

                    <Form.Item label="Blue" name="blue" required={true}>
                        <InputNumber min={0} max={121}/>
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

export default ViewHyperImage;
