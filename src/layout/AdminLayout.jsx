import React, {useEffect, useState} from 'react'
import {useLocation} from 'react-router-dom'
import {
    UserOutlined,
    ArrowLeftOutlined, FolderOpenOutlined
} from '@ant-design/icons'
import {Layout, Menu} from 'antd'
import {Navigate, Outlet, Link} from 'react-router-dom'
import styled from 'styled-components'
import axios from "axios";

const {Header, Sider, Content} = Layout

const StyledLogo = styled.figure`
    display: block;

    img {
        width: 100%;
    }
`

const logoutStyle = {
    position: 'absolute',
    bottom: 0,
    color: 'red',

};

const StyledLayout = styled(Layout)`
    .ant-menu-item {
        padding-left: 1rem !important;
    }
`

const AdminLayout = () => {
    let location = useLocation()
    const [current, setCurrent] = useState('manage-user')
    const user = sessionStorage.getItem('isLogin')

    if (!user) {
        return <Navigate to="/login"/>
    }

    return (
        <StyledLayout>
            <Sider>
                <StyledLogo>
                    {/*<img*/}
                    {/*  src="logo.png"*/}
                    {/*  alt="Logo"*/}
                    {/*/>*/}
                </StyledLogo>
                <Menu
                    theme="dark"
                    mode="inline"
                    selectedKeys={[current]}
                >
                    <Link to="/admin/manage-user">
                        <Menu.Item
                            eventKey="manage-user"
                            icon={<UserOutlined/>}
                            onClick={() => setCurrent('manage-user')}
                        >
                            Manage User
                        </Menu.Item>
                    </Link>
                    <Link to="/admin/manage-file">
                        <Menu.Item
                            eventKey="manage-file"
                            icon={<FolderOpenOutlined/>}
                            onClick={() => setCurrent('manage-file')}
                        >
                            Manage File
                        </Menu.Item>
                    </Link>
                    <Link to="/login">
                        <Menu.Item style={logoutStyle}
                                   eventKey="logout"
                                   icon={<ArrowLeftOutlined/>}
                                   onClick={() => setCurrent('logout')}
                        >
                            Logout
                        </Menu.Item>
                    </Link>
                </Menu>
            </Sider>
            <Layout>
                <Header
                    style={{
                        padding: 0,
                        background: 'white'
                    }}
                >

                </Header>
                <Content
                    style={{
                        margin: '24px 16px',
                        padding: 24,
                        minHeight: 280,
                        background: 'white'
                    }}
                >
                    <Outlet/>
                </Content>
            </Layout>
        </StyledLayout>
    )
}

export default AdminLayout;
