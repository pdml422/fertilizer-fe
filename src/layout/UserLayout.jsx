import React, { useState } from 'react'
import { useLocation } from 'react-router-dom'
import {
    MenuFoldOutlined,
    MenuUnfoldOutlined,
    ProfileOutlined,
    ArrowLeftOutlined,
    PictureOutlined,
    FileOutlined, FolderOutlined, FolderOpenOutlined, LineChartOutlined
} from '@ant-design/icons'
import {Layout, Menu, Button, Space} from 'antd'
import { Navigate, Outlet, Link } from 'react-router-dom'
import styled from 'styled-components'
import SubMenu from "antd/es/menu/SubMenu";

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

                    <Link to="user/view-image">
                        <Menu.Item
                            eventKey="view-image"
                            icon={<PictureOutlined />}
                            onClick={() => setCurrent('view-image')}
                        >
                            View Image
                        </Menu.Item>
                    </Link>

                    <Link to="user/predict">
                        <Menu.Item
                            eventKey="predict"
                            icon={<LineChartOutlined />}
                            onClick={() => setCurrent('predict')}
                        >
                            Predict
                        </Menu.Item>
                    </Link>

                    <Link to="/login">
                        <Menu.Item style={logoutStyle}
                                   eventKey="logout"
                                   icon={<ArrowLeftOutlined />}
                                   onClick={() => {
                                       setCurrent('logout')
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
