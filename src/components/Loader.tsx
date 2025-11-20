// Estilos específicos para el componente Loader
import '../styles/loader.css';
import { useEffect, useState } from 'react';

// Definición de las props que recibe el componente
interface LoaderProps {
    // `visible` controla si el loader debe mostrarse o no
    visible: boolean;
}

// Componente funcional que muestra un overlay con animación de entrada/salida
export default function Loader({ visible }: LoaderProps) {
    // `shouldRender` decide si el componente debe renderizarse en el DOM.
    // Se separa de `visible` para poder dejar correr la animación de salida
    // antes de eliminar el elemento del DOM.
    const [shouldRender, setShouldRender] = useState(visible);

    // `fadeClass` contiene la clase CSS que aplica la animación (fade-in / fade-out)
    const [fadeClass, setFadeClass] = useState('fade-in');

    // Efecto que responde a cambios en la prop `visible`.
    // - Cuando `visible` pasa a true, forzamos el render y aplicamos la clase de entrada.
    // - Cuando `visible` pasa a false, aplicamos la clase de salida y esperamos
    //   el tiempo de la transición (500ms) antes de eliminar el elemento.
    useEffect(() => {
        if (visible) {
            // Mostrar inmediatamente y aplicar animación de entrada
            setShouldRender(true);
            setFadeClass('fade-in');
        } else {
            // Aplicar animación de salida
            setFadeClass('fade-out');
            // Después de 500ms (duración de la animación), quitar del DOM
            const timeout = setTimeout(() => setShouldRender(false), 500);
            // Limpiar el timeout si el componente se desmonta o `visible` cambia
            return () => clearTimeout(timeout);
        }
    }, [visible]);

    // Si no debe renderizarse, devolver null evita renderizar el overlay.
    if (!shouldRender) return null;

    // Renderizamos un contenedor con la clase de animación y el elemento visual del loader.
    // La clase `overlay` debería cubrir la pantalla y centrar el loader (ver CSS).
    return (
        <div className={`overlay ${fadeClass}`}>
            {/* Elemento visual del loader. La clase `--4` probablemente controla tamaño/variación. */}
            <span className="loader --4"></span>
        </div>
    );
}
