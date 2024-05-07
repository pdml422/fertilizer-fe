import React, { useState } from 'react'
import { useLocation } from 'react-router-dom'
import {
    MenuFoldOutlined,
    MenuUnfoldOutlined,
    ProfileOutlined,
    ArrowLeftOutlined,
    PictureOutlined,
    FileOutlined, FolderOutlined
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
    const [current, setCurrent] = useState('home')
    const [collapsed, setCollapsed] = useState(false)
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
                    <Link to="/users/files">
                        <Menu.Item
                            eventKey="home"
                            icon={<FileOutlined />}
                            onClick={() => setCurrent('home')}
                        >
                            Files
                        </Menu.Item>
                    </Link>
                    <Link to="users/image">
                        <Menu.Item
                            eventKey="about"
                            icon={<PictureOutlined />}
                            onClick={() => setCurrent('about')}
                        >
                            Image Data
                        </Menu.Item>
                    </Link>
                    <Link to="users/data">
                        <Menu.Item
                            eventKey="posts"
                            icon={<FolderOutlined />}
                            onClick={() => setCurrent('posts')}
                        >
                            Statistical Data
                        </Menu.Item>
                    </Link>
                    <Link to="users/profile">
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
                    <Button
                        type="text"
                        icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                        onClick={() => setCollapsed(!collapsed)}
                        style={{
                            fontSize: '16px',
                            width: 64,
                            height: 64
                        }}
                    />
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
