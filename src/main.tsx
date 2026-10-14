import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import '@fontsource/marcellus/latin-400.css';
import '@fontsource/marcellus/latin-ext-400.css';
import '@fontsource-variable/source-serif-4/opsz.css';
import '@fontsource-variable/source-serif-4/opsz-italic.css';
import '@fontsource-variable/source-sans-3/wght.css';
import '@fontsource/gentium-book-plus/greek-400.css';
import '@fontsource/gentium-book-plus/greek-ext-400.css';
import '@fontsource/gentium-book-plus/greek-400-italic.css';
import './styles/tokens.css';
import './styles/base.css';
import './styles/components.css';
import './styles/pages.css';
import App from './App';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
