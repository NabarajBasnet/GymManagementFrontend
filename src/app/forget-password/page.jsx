import ForgetPassword from "./forgetPassword"

export async function generateMetadata() {
    return {
        title: 'Reset Your Password - Fitbinary',
        description: 'Forgot your Fitbinary password? Enter your email to receive a secure reset link and regain access to your account.',
    };
}

const ForgetPasswordSSR = () => {
    return (
        <ForgetPassword />
    )
}

export default ForgetPasswordSSR;
