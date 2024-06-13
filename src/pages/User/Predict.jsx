import React, {createRef, useEffect, useRef, useState} from "react";
import {Button, Col, Form, InputNumber, Modal, notification, Row, Select, Spin, Steps} from "antd";
import { Stage, Layer, Image, Rect } from 'react-konva';
import axios from "axios";
import useImage from "use-image";

const Predict = () => {
    const [current, setCurrent] = useState(0);
    const [hyperHeaderIdData, setHyperHeaderIdData] = useState([]);
    const [multiHeaderIdData, setMultiHeaderIdData] = useState([]);
    const [model, setModel] = useState([]);
    const [image, setImage] = useState('');
    const [imageCrop, setImageCrop] = useState('');
    const [imagePredict, setImagePredict] = useState('');
    const [disabled, setDisabled] = useState(true);
    const [imageId, setImageId] = useState('');
    const [modelId, setModelId] = useState('');
    const [x, setX] = useState(0);
    const [y, setY] = useState(0);
    const [modalOpen, setModalOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [stageWidth, setStageWidth] = useState(0);
    const [imgWidth, setImgWidth] = useState(0);
    const [imgHeight, setImgHeight] = useState(0);
    const stageHeight = (stageWidth * imgHeight) / imgWidth;

    const divRef = useRef(null);
    useEffect(() => {
        function handleResize() {
            setStageWidth(divRef.current.offsetWidth);
        }

        window.addEventListener('resize', handleResize);
        handleResize(); // Call the function initially to set the stageWidth

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    const SetImg = (image) => {
        const [img] = useImage(image)
        return img
    }

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

    const fetchModel = async () => {
        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
                },
            };
            const response = await axios.get(`http://localhost:8080/predict/model/${localStorage.getItem('userId')}`, config);
            setModel(response.data);
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

    const fetchHyperImageCrop = async (values) => {
        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
                    UserId: localStorage.getItem('userId'),
                },
            };

            const response = await axios.post('http://localhost:8080/predict/hyper/rgb', values, config);
            setImageCrop(response.data);
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

    const fetchPredictHyper = async (values) => {
        setIsLoading(true)
        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
                    UserId: localStorage.getItem('userId'),
                },
            };

            const response = await axios.post('http://localhost:8080/predict/hyper', values, config);
            setImagePredict(response.data);
        } catch (error) {
            console.error('Error fetching data:', error);
            notification.error(
                {
                    message: 'Error',
                    description: 'Please choose a valid image id and RGB values.'
                }
            )
        } finally {
            setIsLoading(false)
        }
    }

    const fetchImageResolution = async (values) => {
        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
                    UserId: localStorage.getItem('userId'),
                },
            };

            const response = await axios.get(`http://localhost:8080/image/resolution/${values.id}`, config);
            setImgWidth(response.data.width);
            setImgHeight(response.data.height);
        } catch (error) {
            console.error('Error fetching data:', error);
            notification.error(
                {
                    message: 'Error'
                }
            )
        }
    }

    const viewImage = (values) => {
        if (isHyper(values.imageId)) {
            fetchHyperImage({
                id: values.imageId,
                red: 40,
                green: 30,
                blue: 20,
            });
        } else {
            fetchMultiImage({
                id: values.imageId,
                red: 3,
                green: 3,
                blue: 3,
            });
        }
        setImageId(values.imageId);
        setDisabled(false);
        fetchImageResolution({
            id: values.imageId
        });
    }


    useEffect(() => {
        fetchHeaderHyper();
        fetchHeaderMulti();
        fetchModel();
    }, []);

    const isHyper = (values) => {
        const hyperIds = [...hyperHeaderIdData].map((item) => item.id);
        return hyperIds.includes(values);
    }


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


    const imageOptions = [
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



    const viewArea = (values) => {
        fetchHyperImageCrop({
            imageId: imageId,
            x: values.x,
            y: values.y,
        })

        setX(values.x)
        setY(values.y)
        setDisabled(false)

    }

    const next = () => {
        setCurrent(current + 1);
        setDisabled(true)
    };
    const prev = () => {
        setCurrent(current - 1);
    };

    const selectImage = () => {
        return (
            <div style={{marginTop: '20px'}}>
                <Form onFinish={viewImage} style={{width: '100%'}}>
                    <Row justify="space-around" style={{width: '100%'}}>
                        <Col span={16}>
                            <Form.Item label="Image" name="imageId"
                                       rules={[{required: true, message: 'Please choose an image!'}]}>
                                <Select options={imageOptions} style={{width: '100%'}}/>
                            </Form.Item>
                        </Col>

                        <Col span={4}>
                            <Form.Item>
                                <Button type="primary" htmlType="submit" style={{width: '80%'}}>
                                    View Image
                                </Button>
                            </Form.Item>
                        </Col>
                    </Row>
                </Form>

                <div style={{justifyContent: 'center', marginTop: '10px'}}>
                    <img src={image} style={{width: '100%'}}/>

                </div>
            </div>
        )
    }

    const SelectSection = () => {

        return (
            <div style={{marginTop: '20px'}} >
                <Form onFinish={viewArea} style={{width: '100%'}}>
                    <Row justify="space-around" style={{width: '100%'}}>
                        <Col span={6}>
                            <Form.Item label="X" name="x"
                                       rules={[{required: true, message: 'Please choose a number'}]}>
                                <InputNumber min={0} />
                            </Form.Item>
                        </Col>

                        <Col span={6}>
                            <Form.Item label="Y" name="y"
                                       rules={[{required: true, message: 'Please choose a number!'}]}>
                                <InputNumber min={0} />
                            </Form.Item>
                        </Col>

                        <Col span={4}>
                            <Form.Item>
                                <Button type="primary" htmlType="submit" style={{width: '80%'}}>
                                    Select Section
                                </Button>
                            </Form.Item>
                        </Col>
                    </Row>
                </Form>

                <div style={{justifyContent: 'center', marginTop: '10px', width:'100%'}} >
                    {/*<img src={image} style={{width: '100%'}}/>*/}

                    <Stage width={stageWidth} height={stageHeight}>
                        <Layer>
                            <Image image={SetImg(image)} scaleX={stageWidth / imgWidth} scaleY={stageWidth / imgWidth}/>
                            <Rect
                                x={x * (stageWidth / imgWidth) - 72 * (stageWidth / imgWidth)}
                                y={y * (stageWidth / imgWidth) - 72 * (stageWidth / imgWidth)}
                                width={144 * (stageWidth / imgWidth)}
                                height={144 * (stageWidth / imgWidth)}
                                stroke="red"
                                strokeWidth={4}
                            />
                        </Layer>
                    </Stage>

                </div>
            </div>

        )
    }

    const modelOptions = [...model].map((item) => {
        const fileName = item.path.split('/').pop();
        return {
            label: fileName,
            value: item.id,
        };
    });

    const useModel = (values) => {
        setModelId(values.model)
        setDisabled(false)
    }

    const selectModel = () => {

        return (
            <div style={{marginTop: '20px'}}>
                <Form onFinish={useModel} style={{width: '100%'}}>
                    <Row justify="space-around" style={{width: '100%'}}>
                        <Col span={16}>
                            <Form.Item label="Model" name="model"
                                       rules={[{required: true, message: 'Please choose a model!'}]}>
                                <Select options={modelOptions} style={{width: '100%'}}/>
                            </Form.Item>
                        </Col>

                        <Col span={4}>
                            <Form.Item>
                                <Button type="primary" htmlType="submit" style={{width: '80%'}}>
                                    Use Model
                                </Button>
                            </Form.Item>
                        </Col>
                    </Row>
                </Form>

                <div style={{justifyContent: 'center', marginTop: '10px'}}>
                    <img src={imageCrop} style={{width: '100%'}}/>
                </div>
            </div>
        )
    }

    const steps = [
        {
            title: 'Select Image',
            content: selectImage(),
        },
        {
            title: 'Select Section',
            content: SelectSection(),
        },
        {
            title: 'Select Model',
            content: selectModel(),
        },
    ];

    const items = steps.map((item) => ({
        key: item.title,
        title: item.title,
    }));

    const predict = () => {
        fetchPredictHyper({
            imageId: imageId,
            modelId: modelId,
            x: x,
            y: y,
        })

        setModalOpen(true)
    }

    const handleOk = () => {
        setModalOpen(false)
    }


    return (
        <>
            <div style={{width:'100%'}} ref={divRef} />

            <Steps current={current} items={items}/>
            <div>
                {steps[current].content}
            </div>

            {current < steps.length - 1 && (
                <Button type="primary" onClick={() => next()} style={{marginTop:'10px'}} disabled={disabled}>
                    Next
                </Button>
            )}
            {current === steps.length - 1 && (
                <Button type="primary" onClick={() => predict()} style={{marginTop:'10px'}} disabled={disabled}>
                    Predict
                </Button>
            )}

            {current > 0 && (
                <Button style={{margin: '10px 10px',}} onClick={() => prev()}>
                    Previous
                </Button>
            )}

            <Modal open={modalOpen}
                   onOk={handleOk}
                   onCancel={handleOk}
                   footer={[
                <Button key="ok" type="primary" onClick={handleOk}>
                    OK
                </Button>
            ]}>
                <img src={imageCrop} style={{width: '50%'}}/>
                {isLoading ? <Spin /> : <img src={imagePredict} style={{width: '50%'}}/>}
            </Modal>

        </>

    )
}

export default Predict;
