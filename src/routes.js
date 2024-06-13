import React, {Suspense} from 'react'
import {useRoutes} from 'react-router-dom'
import AdminLayout from './layout/AdminLayout'
import DefaultLayout from './layout/DefaultLayout'
import UserLayout from "./layout/UserLayout";

const LoginPage = React.lazy(() => import('./pages/Login'))
const RegisterPage = React.lazy(() => import('./pages/Register'))

const ManageUser = React.lazy(() => import('./pages/Admin/ManageUser'))
const ManageFile = React.lazy(() => import('./pages/Admin/ManageFile'))

const ViewFile = React.lazy(() => import('./pages/User/ViewFile'))
const ViewImage = React.lazy(() => import('./pages/User/ViewImage'))
const Predict = React.lazy(() => import('./pages/User/Predict'))

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
                    path: '/admin/manage-file',
                    element: <LoadComponent component={ManageFile}/>
                },
            ]
        },
        {
            element: <UserLayout/>,
            children: [
                {
                    path: '/user/view-file',
                    element: <LoadComponent component={ViewFile}/>
                },
                {
                    path: 'user/view-image',
                    element: <LoadComponent component={ViewImage}/>
                },
                {
                    path: 'user/predict',
                    element: <LoadComponent component={Predict}/>
                }
            ]
        }
    ])
}

export {AllRoutes}
