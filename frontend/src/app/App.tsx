import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";

import { AppRoutes } from "@/routes/AppRoutes";
import { authStorage } from "@/shared/api";
import { setSession } from "@/store/authSlice";
import { store } from "@/store/store";

const session = authStorage.getSession();

if (session) {
  store.dispatch(setSession(session));
}

export function App(): React.JSX.Element {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </Provider>
  );
}
