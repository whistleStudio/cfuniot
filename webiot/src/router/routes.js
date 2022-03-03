const Login = () => import("views/login/Login")
const Register = () => import("views/register/Register")
const User = () => import("views/user/User")
const U0 = () => import("views/user/u0/U0")
const U1 = () => import("views/user/u1/U1")
const U2 = () => import("views/user/u2/U2")
const ResetPwd = () => import("views/register/ResetPwd")
const Intro = () => import("views/intro/Intro")

const routes = [
  {
    path: "",
    redirect: "/login"
  },
  {
    path: "/login",
    component: Login
  },
  {
    path: "/register",
    component: Register,
  },
  {
    path: "/ResetPwd",
    component: ResetPwd
  },
  {
    path: "/user",
    component: User,
    children: [
      {
        path: "",
        redirect: "/user/intro"
      },
      {
        path: "intro",
        component: Intro
      },
      {
        path: "device",
        component: U0
      },
      {
        path: "ctrl",
        component: U1
      },
      {
        path: "data",
        component: U2
      }
    ]
  }
]

export default routes