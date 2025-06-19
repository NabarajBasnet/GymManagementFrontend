import TenantSetting from "./settingsWrapper";

export async function generateMetadata() {
  return {
    title: 'Clientarea Settings | Liftora | Modern Gym Management'
  }
}

const MainSetting = () => {
  return (
    <TenantSetting />
  )
}
export default MainSetting;
