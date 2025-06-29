import TenantSetting from "./settingsWrapper";

export async function generateMetadata() {
  return {
    title: 'Settings - FitBinary - Modern Gym Management Software'
  }
}

const MainSetting = () => {
  return (
    <TenantSetting />
  )
}
export default MainSetting;
