import ForgetPassword from "./forgetPassword"

export async function generateMetadata() {
    return {
        title: 'Forget Password | GeoFit'
    }
}

const ForgetPasswordSSR = () => {
    return (
        <ForgetPassword />
    )
}

export default ForgetPasswordSSR;
