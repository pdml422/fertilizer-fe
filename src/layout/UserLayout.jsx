import React, { useState } from 'react'
import { useLocation } from 'react-router-dom'
import {
    MenuFoldOutlined,
    MenuUnfoldOutlined,
    ProfileOutlined,
    ArrowLeftOutlined,
    PictureOutlined,
    FileOutlined, FolderOutlined, FolderOpenOutlined
} from '@ant-design/icons'
import { Layout, Menu, Button } from 'antd'
import { Navigate, Outlet, Link } from 'react-router-dom'
import styled from 'styled-components'

const { Header, Sider, Content } = Layout

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

const UserLayout = () => {
    let location = useLocation()
    const [current, setCurrent] = useState('view-file')
    const user = sessionStorage.getItem('isLogin')

    if (!user) {
        return <Navigate to="/login" />
    }

    return (
        <StyledLayout>
            <Sider
            >
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
                    <Link to="/user/view-file">
                        <Menu.Item
                            eventKey="view-file"
                            icon={<FolderOpenOutlined />}
                            onClick={() => setCurrent('view-file')}
                        >
                            Files
                        </Menu.Item>
                    </Link>
                    <Link to="user/image">
                        <Menu.Item
                            eventKey="about"
                            icon={<PictureOutlined />}
                            onClick={() => setCurrent('about')}
                        >
                            Image Data
                        </Menu.Item>
                    </Link>
                    <Link to="user/data">
                        <Menu.Item
                            eventKey="posts"
                            icon={<FolderOutlined />}
                            onClick={() => setCurrent('posts')}
                        >
                            Statistical Data
                        </Menu.Item>
                    </Link>
                    <Link to="user/profile">
                        <Menu.Item
                            eventKey="profile"
                            icon={<ProfileOutlined />}
                            onClick={() => setCurrent('profile')}
                        >
                            Profile
                        </Menu.Item>
                    </Link>
                    <Link to="/login">
                        <Menu.Item style={logoutStyle}
                                   eventKey="logout"
                                   icon={<ArrowLeftOutlined />}
                                   onClick={() => {
                                       setCurrent('logout')
                                       localStorage.removeItem('red');
                                       localStorage.removeItem('green');
                                       localStorage.removeItem('blue');
                                       localStorage.removeItem('id');
                        }}
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
                    <Outlet />
                </Content>
            </Layout>
        </StyledLayout>
    )
}

export default UserLayout;
