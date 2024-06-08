import Forms from "../components/Forms";

const Login = () => {
  return (
    <>
      <Forms route="/api/token/" method="login" />
    </>
  );
};

export default Login;
