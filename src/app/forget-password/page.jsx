import ForgetPassword from "./forgetPassword"

export async function generateMetadata() {
    return {
        title: 'Reset Your Password - GeoFit',
        description: 'Forgot your GeoFit password? Enter your email to receive a secure reset link and regain access to your account.',
    };
}

const ForgetPasswordSSR = () => {
    return (
        <ForgetPassword />
    )
}

export default ForgetPasswordSSR;
