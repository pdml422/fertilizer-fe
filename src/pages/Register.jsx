import React from 'react'
import {Button, Card, Checkbox, Form, Input} from 'antd'
import styled from 'styled-components'
import {Link, useNavigate} from 'react-router-dom'
import axios from "axios";

const Wrapper = styled.section`
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: rgba(0, 0, 0, 0.02);

    h1 {
        text-align: center;
    }
`

const StyledForm = styled(Form)`
    width: 500px;

    .ant-form-item-label label {
        width: 150px;
    }

    button {
        width: 100%;
        margin-bottom: 1rem;
    }
`

const Register = () => {
    const navigate = useNavigate()
    const [form] = Form.useForm()

    const onFinish = async (values) => {
        try {
            const response = await axios.post('http://localhost:8080/auth/register', values);
            console.log('Registration successful:',response.data);
            navigate('/login')
        } catch (error) {
            console.error('Error registering user:', error);
            navigate('/register')
        }
    }

    return (
        <Wrapper>
            <Card>
                <h1>Register</h1>
                <StyledForm
                    form={form}
                    name="register"
                    onFinish={onFinish}
                >
                    <Form.Item
                        name="name"
                        label="Name"
                        rules={[
                            {
                                required: true,
                                message: 'Please input your name!',
                                whitespace: true
                            }
                        ]}
                    >
                        <Input/>
                    </Form.Item>

                    <Form.Item
                        name="username"
                        label="Username"
                        rules={[
                            {
                                required: true,
                                message: 'Please input your username!',
                                whitespace: true
                            }
                        ]}
                    >
                        <Input/>
                    </Form.Item>

                    <Form.Item
                        name="email"
                        label="E-mail"
                        rules={[
                            {
                                type: 'email',
                                message: 'The input is not valid E-mail!'
                            },
                            {
                                required: true,
                                message: 'Please input your E-mail!'
                            }
                        ]}
                    >
                        <Input/>
                    </Form.Item>

                    <Form.Item
                        name="password"
                        label="Password"
                        rules={[
                            {
                                required: true,
                                message: 'Please input your password!'
                            }
                        ]}
                        hasFeedback
                    >
                        <Input.Password/>
                    </Form.Item>

                    <Form.Item
                        name="confirm"
                        label="Confirm Password"
                        dependencies={['password']}
                        hasFeedback
                        rules={[
                            {
                                required: true,
                                message: 'Please confirm your password!'
                            },
                            ({getFieldValue}) => ({
                                validator(_, value) {
                                    if (!value || getFieldValue('password') === value) {
                                        return Promise.resolve()
                                    }
                                    return Promise.reject(
                                        new Error('The new password that you entered do not match!')
                                    )
                                }
                            })
                        ]}
                    >
                        <Input.Password/>
                    </Form.Item>

                    <Form.Item
                        name="agreement"
                        valuePropName="checked"
                        rules={[
                            {
                                validator: (_, value) =>
                                    value ? Promise.resolve() : Promise.reject(new Error('Should accept agreement'))
                            }
                        ]}
                    >
                        <Checkbox>I agree with terms and conditions</Checkbox>
                    </Form.Item>
                    <Form.Item>
                        <Button
                            type="primary"
                            htmlType="submit"
                        >
                            Register
                        </Button>
                        Already Register? <Link to="/login">Log In</Link>
                    </Form.Item>
                </StyledForm>
            </Card>
        </Wrapper>
    )
}

export default Register;
