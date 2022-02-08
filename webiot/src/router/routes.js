const Login = () => import("views/login/Login")
const Register = () => import("views/register/Register")

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
  }
]

export default routes