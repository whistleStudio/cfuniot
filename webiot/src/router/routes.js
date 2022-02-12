const Login = () => import("views/login/Login")
const Register = () => import("views/register/Register")
const User = () => import("views/user/User")

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
    component: Register
  },
  {
    path: "/user",
    component: User
  }
]

export default routes