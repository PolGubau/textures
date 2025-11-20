// React hooks usados por el componente
import { useEffect, useRef, useState } from 'react';
// GSAP para animaciones y SplitText para animar líneas de texto
import gsap from 'gsap';
import { SplitText } from 'gsap/SplitText';

// Registramos el plugin de SplitText una vez
gsap.registerPlugin(SplitText);

// Tipos/Interfaces: definen la forma de datos que usa el componente
interface Source {
    src: string; // ruta o nombre de la imagen (se usa con `/img/${src}`)
    caption: string; // texto descriptivo que aparece sobre/junto a la imagen
}

interface Data {
    x: number; // posición X de diseño (valor relativo que se escala)
    y: number; // posición Y de diseño
    w: number; // ancho de diseño
    h: number; // alto de diseño
}

interface InfiniteGridProps {
    sources: Source[]; // lista de imágenes/captions
    data: Data[]; // layout original con posiciones y tamaños
    originalSize: { w: number; h: number }; // referencia de tamaño original
}

// Representación interna de cada tile creado en el DOM
interface Item {
    el: HTMLDivElement; // contenedor del tile en el DOM
    img: HTMLImageElement; // elemento <img> real usado
    x: number; // posición X actual (en px) antes de aplicar extraX
    y: number; // posición Y actual (en px)
    w: number; // ancho en px
    h: number; // alto en px
    extraX: number; // desplazamiento extra usado para el wrapping infinito
    extraY: number; // idem en Y
    rect: DOMRect; // rectángulo calculado del elemento (para efectos/parallax)
    ease: number; // factor de easing individual para variaciones
}

const InfiniteGrid: React.FC<InfiniteGridProps> = ({ sources, data, originalSize }) => {
    // Referencia al contenedor donde se inyectan los tiles (manipulación DOM directa)
    const containerRef = useRef<HTMLDivElement>(null);
    // Estado del popup que muestra la imagen grande al hacer click
    const [popup, setPopup] = useState<{ src: string; caption: string } | null>(null);
    // Refs para animar el popup con GSAP
    const popupImageRef = useRef<HTMLImageElement>(null);
    const overlayRef = useRef<HTMLDivElement>(null);

    // Efecto que se ejecuta cuando `popup` cambia: animaciones de entrada
    useEffect(() => {
        if (popup && popupImageRef.current && overlayRef.current) {
            // Fade-in del overlay
            gsap.fromTo(
                overlayRef.current,
                { opacity: 0 },
                { opacity: 1, duration: 0.3, ease: 'power2.out' }
            );
            // Zoom + fade-in de la imagen del popup
            gsap.fromTo(
                popupImageRef.current,
                { scale: 0.8, opacity: 0 },
                { scale: 1, opacity: 1, duration: 0.5, ease: 'power2.out' }
            );
        }
    }, [popup]);

    useEffect(() => {
        const el = containerRef.current!;
        const initialize = () => {
            // Medidas de la ventana actuales (se recalculan al inicializar)
            const winW = window.innerWidth;
            const winH = window.innerHeight;

            // Detección básica de móvil (puedes ajustar el breakpoint)
            // `mobileBoost` se usa para escalar la referencia de ancho en móvil
            // cuando las imágenes de referencia son muy grandes.
            const isMobile = winW < 768;
            const mobileBoost = isMobile ? 2.5 : 1; // aumentar para ver imágenes más grandes en móvil

            // Parámetros que afectan la separación y sensibilidad en móvil
            const spacingFactor = isMobile ? 1.6 : 1; // separa las posiciones X/Y en móvil
            const dragSensitivity = isMobile ? 1.6 : 1; // hace el drag más reactivo
            const touchSensitivity = isMobile ? 1.6 : 1; // sensibilidad para touch

            // Tamaño del 'tile' de referencia en píxeles (se usa para repetir el patrón)
            const tileSize = {
                w: winW * mobileBoost,
                h: winW * mobileBoost * (originalSize.h / originalSize.w),
            };

            // Estado virtual de scroll: target vs current para interpolar movimiento
            const scroll = {
                // ease controla la rapidez con la que current se acerca a target
                ease: isMobile ? 0.12 : 0.06,
                current: { x: -winW * 0.1, y: -winH * 0.1 },
                target: { x: -winW * 0.1, y: -winH * 0.1 },
                last: { x: -winW * 0.1, y: -winH * 0.1 },
                delta: { x: { c: 0, t: 0 }, y: { c: 0, t: 0 } },
            };

            // Valores relacionados con la posición del ratón/táctil, usados para parallax
            const mouse = {
                x: { t: 0.1, c: 0.1 },
                y: { t: 0.1, c: 0.1 },
                press: { t: 0, c: 0 },
            };

            let isDragging = false;
            const drag = { startX: 0, startY: 0, scrollX: 0, scrollY: 0 };

            // IntersectionObserver para añadir/quitar la clase 'visible' a captions
            // cuando entran o salen del viewport (puede activar animaciones CSS).
            const observer = new IntersectionObserver((entries) => {
                entries.forEach((entry) => {
                    entry.target.classList.toggle('visible', entry.isIntersecting);
                });
            });

            const scaleX = tileSize.w / originalSize.w;
            const scaleY = tileSize.h / originalSize.h;

            // Construcción de los items base a partir de los datos de layout y las
            // imágenes (sources). `spacingFactor` amplía la separación entre
            // coordenadas sin afectar el tamaño de los tiles.
            const baseItems = data.map((d, i) => ({
                ...d,
                src: sources[i % sources.length].src,
                caption: sources[i % sources.length].caption,
                x: d.x * scaleX * spacingFactor,
                y: d.y * scaleY * spacingFactor,
                w: d.w * scaleX,
                h: d.h * scaleY,
            }));

            const repsX = [0, tileSize.w];
            const repsY = [0, tileSize.h];
            const items: Item[] = [];

            el.innerHTML = '';

            // Crear DOM para cada baseItem y sus repeticiones (repsX/Y) para
            // conseguir el efecto de grid infinito. Cada tile se construye usando
            // elementos DOM puros para un control más directo.
            baseItems.forEach((base) => {
                repsX.forEach((offsetX) => {
                    repsY.forEach((offsetY) => {
                        const itemEl = document.createElement('div');
                        itemEl.className = 'item absolute top-0 left-0';
                        itemEl.style.width = `${base.w}px`;

                        const wrapper = document.createElement('div');
                        wrapper.className = 'item-wrapper will-change-transform';

                        const itemImage = document.createElement('div');
                        itemImage.className = 'item-image overflow-hidden';
                        itemImage.style.width = `${base.w}px`;
                        itemImage.style.height = `${base.h}px`;

                        const img = new Image();
                        img.src = `/img/${base.src}`; // carga desde public/img
                        img.className = 'w-full h-full object-cover will-change-transform custom-shadow opacity-0 scale-95';
                        img.addEventListener('click', () => {
                            // Abrir popup al clickar la imagen
                            setPopup({ src: base.src, caption: base.caption });
                        });

                        itemImage.appendChild(img);
                        wrapper.appendChild(itemImage);

                        const caption = document.createElement('small');
                        // Caption con diferente estilo en móvil vs escritorio
                        caption.className = isMobile
                            ? 'block text-[14px] mt-[1.2rem] leading-[1.25]'
                            : 'block text-[16px] mt-[12rem] leading-[1.25]';
                        caption.innerHTML = base.caption;
                        wrapper.appendChild(caption);

                        itemEl.appendChild(wrapper);
                        el.appendChild(itemEl);

                        // Animaciones de entrada: SplitText para las líneas del caption
                        const split = new SplitText(caption, { type: 'lines', linesClass: 'line' });
                        gsap.set(split.lines, { opacity: 0, y: 2 });
                        gsap.to(split.lines, {
                            opacity: 1,
                            y: 0,
                            duration: 0.4,
                            ease: 'power2.out',
                            stagger: 0.1,
                            delay: 0.1,
                        });

                        // Fade-in + scale del img
                        gsap.to(img, {
                            opacity: 1,
                            scale: 1,
                            duration: 0.6,
                            ease: 'power2.out',
                            delay: 0.1 + Math.random() * 0.3,
                        });

                        observer.observe(caption);

                        // Guardar item para el loop de render
                        items.push({
                            el: itemEl,
                            img,
                            x: base.x + offsetX,
                            y: base.y + offsetY,
                            w: base.w,
                            h: base.h,
                            extraX: 0,
                            extraY: 0,
                            rect: itemEl.getBoundingClientRect(),
                            ease: Math.random() * 0.5 + 0.5,
                        });
                    });
                });
            });

            tileSize.w *= 2;
            tileSize.h *= 2;

            // Wheel handler: mueve la cámara virtual según la rueda/trackpad
            const onWheel = (e: WheelEvent) => {
                e.preventDefault();
                const factor = 0.4;
                scroll.target.x -= e.deltaX * factor;
                scroll.target.y -= e.deltaY * factor;
            };

            // Mouse move: actualiza parallax y permite arrastrar con el ratón
            const onMouseMove = (e: MouseEvent) => {
                mouse.x.t = e.clientX / winW;
                mouse.y.t = e.clientY / winH;
                if (isDragging) {
                    const dx = e.clientX - drag.startX;
                    const dy = e.clientY - drag.startY;
                    // Aplicar sensibilidad al arrastre para que resulte más rápido en móvil
                    scroll.target.x = drag.scrollX + dx * dragSensitivity;
                    scroll.target.y = drag.scrollY + dy * dragSensitivity;
                }
            };

            const onMouseDown = (e: MouseEvent) => {
                e.preventDefault();
                isDragging = true;
                document.documentElement.classList.add('dragging');
                drag.startX = e.clientX;
                drag.startY = e.clientY;
                drag.scrollX = scroll.target.x;
                drag.scrollY = scroll.target.y;
                mouse.press.t = 1;
            };

            const onMouseUp = () => {
                isDragging = false;
                document.documentElement.classList.remove('dragging');
                mouse.press.t = 0;
            };

            const onTouchStart = (e: TouchEvent) => {
                if (e.touches.length !== 1) return;
                isDragging = true;
                document.documentElement.classList.add('dragging');
                drag.startX = e.touches[0].clientX;
                drag.startY = e.touches[0].clientY;
                drag.scrollX = scroll.target.x;
                drag.scrollY = scroll.target.y;
                mouse.press.t = 1;
            };

            // Touch move: arrastre táctil con sensibilidad ajustable
            const onTouchMove = (e: TouchEvent) => {
                if (!isDragging || e.touches.length !== 1) return;
                const dx = e.touches[0].clientX - drag.startX;
                const dy = e.touches[0].clientY - drag.startY;
                // Multiplicar por `touchSensitivity` para que el desplazamiento táctil
                // tenga más inercia/respuesta en dispositivos móviles.
                scroll.target.x = drag.scrollX + dx * touchSensitivity;
                scroll.target.y = drag.scrollY + dy * touchSensitivity;
            };

            const onTouchEnd = () => {
                isDragging = false;
                document.documentElement.classList.remove('dragging');
                mouse.press.t = 0;
            };

            // Loop principal de render: interpola la posición 'current' hacia 'target'
            // y aplica transformaciones a cada tile. También gestiona el wrap infinito.
            const render = () => {
                // lerp simple para suavizar la cámara
                scroll.current.x += (scroll.target.x - scroll.current.x) * scroll.ease;
                scroll.current.y += (scroll.target.y - scroll.current.y) * scroll.ease;

                // calcular variaciones/deltas para efectos secundarios (parallax)
                scroll.delta.x.t = scroll.current.x - scroll.last.x;
                scroll.delta.y.t = scroll.current.y - scroll.last.y;
                scroll.delta.x.c += (scroll.delta.x.t - scroll.delta.x.c) * 0.04;
                scroll.delta.y.c += (scroll.delta.y.t - scroll.delta.y.c) * 0.04;
                mouse.x.c += (mouse.x.t - mouse.x.c) * 0.04;
                mouse.y.c += (mouse.y.t - mouse.y.c) * 0.04;
                mouse.press.c += (mouse.press.t - mouse.press.c) * 0.04;

                const dirX = scroll.current.x > scroll.last.x ? 'right' : 'left';
                const dirY = scroll.current.y > scroll.last.y ? 'down' : 'up';

                items.forEach((item) => {
                    // pequeñas oscilaciones en función de la velocidad y posición del ratón
                    const newX = 5 * scroll.delta.x.c * item.ease + (mouse.x.c - 0.5) * item.rect.width * 0.6;
                    const newY = 5 * scroll.delta.y.c * item.ease + (mouse.y.c - 0.5) * item.rect.height * 0.6;

                    const posX = item.x + scroll.current.x + item.extraX + newX;
                    const posY = item.y + scroll.current.y + item.extraY + newY;

                    // wrap: si el tile sale fuera del viewport, lo movemos al otro lado
                    if (dirX === 'right' && posX > winW) item.extraX -= tileSize.w;
                    if (dirX === 'left' && posX + item.rect.width < 0) item.extraX += tileSize.w;
                    if (dirY === 'down' && posY > winH) item.extraY -= tileSize.h;
                    if (dirY === 'up' && posY + item.rect.height < 0) item.extraY += tileSize.h;

                    const fx = item.x + scroll.current.x + item.extraX + newX;
                    const fy = item.y + scroll.current.y + item.extraY + newY;

                    // Aplicar transform al contenedor y al propio img para efecto visual
                    item.el.style.transform = `translate(${fx}px, ${fy}px)`;
                    item.img.style.transform = `scale(${1.2 + 0.2 * mouse.press.c * item.ease}) translate(${-mouse.x.c * item.ease * 10}%, ${-mouse.y.c * item.ease * 10}%)`;
                });

                // guardar último estado y pedir siguiente frame
                scroll.last.x = scroll.current.x;
                scroll.last.y = scroll.current.y;
                requestAnimationFrame(render);
            };

            window.addEventListener('wheel', onWheel, { passive: false });
            window.addEventListener('mousemove', onMouseMove);
            window.addEventListener('mousedown', onMouseDown);
            window.addEventListener('mouseup', onMouseUp);
            window.addEventListener('touchstart', onTouchStart, { passive: false });
            window.addEventListener('touchmove', onTouchMove, { passive: false });
            window.addEventListener('touchend', onTouchEnd);

            render();

            return () => {
                window.removeEventListener('wheel', onWheel);
                window.removeEventListener('mousemove', onMouseMove);
                window.removeEventListener('mousedown', onMouseDown);
                window.removeEventListener('mouseup', onMouseUp);
                window.removeEventListener('touchstart', onTouchStart);
                window.removeEventListener('touchmove', onTouchMove);
                window.removeEventListener('touchend', onTouchEnd);
                observer.disconnect();
            };
        };

        if (document.fonts && document.fonts.ready) {
            document.fonts.ready.then(initialize);
        } else {
            setTimeout(initialize, 500);
        }
    }, [sources, data, originalSize]);

    return (
        <>
            <div
                id="images"
                ref={containerRef}
                className="w-full h-full inline-block whitespace-nowrap relative"
            />
            {popup && (
                <div
                    ref={overlayRef}
                    onClick={() => setPopup(null)}
                    className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center cursor-pointer"
                >
                    <div className="max-w-[90vw] max-h-[90vh] text-center flex flex-col gap-4" onClick={(e) => e.stopPropagation()}>
                    <nav className='flex items-center justify-end'>
                            <a className='z-20 text-white/80 hover:text-white hover:bg-white/10 transition-all rounded-full p-2' download
                            href={`/img/${popup.src}`}
                            ><svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="currentColor"><path d="M480-320 280-520l56-58 104 104v-326h80v326l104-104 56 58-200 200ZM240-160q-33 0-56.5-23.5T160-240v-120h80v120h480v-120h80v120q0 33-23.5 56.5T720-160H240Z"/></svg></a>
                    </nav>
                        <img
                            ref={popupImageRef}
                            src={`/img/${popup.src}`}
                            alt="popup"
                            className="max-h-[70vh] mx-auto mb-4 rounded-xl shadow-2xl"
                        />
                    </div>
                </div>
            )}
        </>
    );
};

export default InfiniteGrid;
