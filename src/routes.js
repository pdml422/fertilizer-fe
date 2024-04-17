import React, {Suspense} from 'react'
import {useRoutes} from 'react-router-dom'
import AdminLayout from './layout/AdminLayout'
import DefaultLayout from './layout/DefaultLayout'

const LoginPage = React.lazy(() => import('./pages/Login'))
const RegisterPage = React.lazy(() => import('./pages/Register'))

const ManageUser = React.lazy(() => import('./pages/Admin/ManageUser'))
// const ManageFile = React.lazy(() => import('./pages/Admin/ManageFile'))

// const UserPage = React.lazy(() => import('./pages/User'))
// const PostPage = React.lazy(() => import('./pages/Post'))

const loading = () => <div className=""/>

export const LoadComponent = ({component: Component}) => (
    <Suspense fallback={loading()}>
        <Component/>
    </Suspense>
)

const AllRoutes = () => {
    return useRoutes([
        {
            element: <DefaultLayout/>,
            children: [
                {
                    path: '/login',
                    element: <LoadComponent component={LoginPage}/>
                },
                {
                    path: '/register',
                    element: <LoadComponent component={RegisterPage}/>
                }
            ]
        },
        {
            element: <AdminLayout/>,
            children: [
                {
                    path: '/admin/manage-user',
                    element: <LoadComponent component={ManageUser}/>
                },
                {
                    // path: '/admin/manage-file',
                    // element: <LoadComponent component={ManageFile}/>
                },
                {
                    path: '/posts',
                    // element: <LoadComponent component={PostPage}/>
                }
            ]
        }
    ])
}

export {AllRoutes}
