import { Provider } from "react-redux";
import store from "./store";

const MainStateProvider = ({ children }) => {
    <Provider store={store}>
        {children}
    </Provider>
}

export default MainStateProvider;
