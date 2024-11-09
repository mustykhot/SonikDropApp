import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css';
import 'react-toastify/dist/ReactToastify.css';
import {createBrowserRouter, RouterProvider} from "react-router-dom";
import AirdropPage from './pages/Airdrop.tsx';
import { store } from './store/store.ts';
import { Provider } from 'react-redux';
import PoapPage from './pages/Poap.tsx';

const router = createBrowserRouter([
  {
    path: "/airdrop",
    element: <AirdropPage />
  },
  {
    path: "/poap",
    element: <PoapPage />
  },
  {
    path: "/",
    element: <App />
  },
]);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  </StrictMode>,
)
