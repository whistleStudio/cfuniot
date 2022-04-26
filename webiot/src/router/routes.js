import Login from "views/login/Login"
const Register = res => require(["views/register/Register"], res)
const User = res => require(["views/user/User"], res)
const U0 = res => require(["views/user/u0/U0"], res)
const U1 = res => require(["views/user/u1/U1"], res)
const U2 = res => require(["views/user/u2/U2"], res)
const ResetPwd = res => require(["views/register/ResetPwd"], res)
const Intro = res => require(["views/intro/Intro"], res)

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