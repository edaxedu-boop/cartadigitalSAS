import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

console.log("MenuPe: Iniciando aplicación...");

const rootElement = document.getElementById('root');

if (rootElement) {
  try {
    const root = ReactDOM.createRoot(rootElement);
    root.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
  } catch (error) {
    console.error("MenuPe: Error fatal durante el renderizado:", error);
  }
} else {
  console.error("MenuPe: No se encontró el elemento raíz 'root' en el DOM.");
}