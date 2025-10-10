import { useState, useEffect } from 'react';

const GalleryModal = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [proyecto, setProyecto] = useState(null);
    const [imagenActualIndex, setImagenActualIndex] = useState(0);

    // Función para dividir la descripción en dos columnas
    const dividirDescripcion = (descripcion) => {
        const lineas = descripcion.split('\n').filter(linea => linea.trim() !== '');

        const columnaIzq = [];
        const columnaDer = [];
        let enTrabajos = false;

        lineas.forEach(linea => {
            if (linea.includes('Trabajo realizado:')) {
                enTrabajos = true;
            }

            if (enTrabajos) {
                columnaDer.push(linea.trim());
            } else {
                columnaIzq.push(linea.trim());
            }
        });

        return { columnaIzq, columnaDer };
    };

  // Escuchar evento para abrir el modal y bloquear scroll
  useEffect(() => {
    // console.log('GalleryModal montado, escuchando eventos...');

    

    const handleOpenGallery = (event) => {
    //   console.log('Evento openGallery capturado en React:', event.detail);
      setProyecto(event.detail.proyecto);
      setIsOpen(true);
      setImagenActualIndex(0);
      
      // Bloquear scroll del body
      document.body.style.overflow = 'hidden';
    };

    document.addEventListener('openGallery', handleOpenGallery);
    
    return () => {
      document.removeEventListener('openGallery', handleOpenGallery);
    };
  }, []);

  // Navegación con teclado
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        handleClose();
      } else if (e.key === 'ArrowLeft') {
        imagenAnterior();
      } else if (e.key === 'ArrowRight') {
        imagenSiguiente();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, imagenActualIndex]);

  const handleClose = () => {
    setIsOpen(false);
    setProyecto(null);
    setImagenActualIndex(0);
    
    // Restaurar scroll del body
    document.body.style.overflow = 'auto';
  };

  const imagenAnterior = () => {
    if (imagenActualIndex > 0) {
      setImagenActualIndex(imagenActualIndex - 1);
    }
  };

  const imagenSiguiente = () => {
    if (proyecto && imagenActualIndex < proyecto.imagenes.length - 1) {
      setImagenActualIndex(imagenActualIndex + 1);
    }
  };

  const seleccionarImagen = (index) => {
    setImagenActualIndex(index);
  };

  if (!isOpen || !proyecto) {
    return null;
  }

  const { columnaIzq, columnaDer } = dividirDescripcion(proyecto.descripcion);

  return (
    <div 
      className="fixed inset-0 bg-black/90 flex items-center justify-center z-[100] p-4 backdrop-blur-sm"
      onClick={handleClose}
    >
      <div 
        className="bg-white rounded-lg shadow-2xl w-full max-w-4xl mx-auto relative max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Botón Cerrar */}
        <button
          onClick={handleClose}
          className="absolute -top-12 right-0 text-white hover:text-gray-300 text-3xl font-bold z-10 rounded-full w-10 h-10 flex items-center justify-center transition-colors bg-black/50 hover:bg-black/70"
          aria-label="Cerrar galería"
        >
          &times;
        </button>

        {/* Header con título y descripción */}
        <div className="p-6 border-b border-gray-200 flex-shrink-0">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            {proyecto.nombre}
          </h2>

          {/* <p className="text-gray-600 whitespace-pre-line text-sm leading-relaxed max-h-20 overflow-y-auto">
            {proyecto.descripcion}
          </p> */}

          {/* Descripción en dos columnas */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">

            {/* Columna Izquierda */}
            <div className="space-y-1">
              {columnaIzq.map((linea, index) => (
                <p 
                  key={`izq-${index}`}
                  className={`text-gray-600 leading-tight ${
                    linea.includes('Obra :') || linea.includes('Obra:') 
                      ? 'font-semibold text-gray-800' 
                      : ''
                  } ${
                    linea.startsWith('•') ? 'ml-2' : ''
                  }`}
                >
                  {linea}
                </p>
              ))}
            </div>
            
            {/* Columna Derecha */}
            <div className="space-y-1">
              {columnaDer.map((linea, index) => (
                <p 
                  key={`der-${index}`}
                  className={`text-gray-600 leading-tight ${
                    linea.includes('Trabajo realizado:') 
                      ? 'font-semibold text-gray-800' 
                      : ''
                  } ${
                    linea.startsWith('•') ? 'ml-2' : ''
                  }`}
                >
                  {linea}
                </p>
              ))}
            </div>
            </div>
        </div>

        {/* Contenido principal - Área de imagen scrollable */}
        <div className="flex-1 overflow-hidden flex flex-col">
          {/* Imagen principal con contenedor scrollable */}
          <div className="flex-1 flex items-center justify-center bg-gray-50 overflow-hidden p-4">
            <div className="relative w-full h-full flex items-center justify-center">
              <img
                src={proyecto.imagenes[imagenActualIndex]}
                alt={`${proyecto.nombre} - Imagen ${imagenActualIndex + 1}`}
                className="max-w-full max-h-full object-contain rounded-lg"
                onError={(e) => {
                  console.error('Error cargando imagen:', proyecto.imagenes[imagenActualIndex]);
                  e.target.src = '/assets/placeholder.jpg'; // Opcional: imagen de respaldo
                }}
              />
              
              {/* Navegación */}
              <button
                onClick={imagenAnterior}
                disabled={imagenActualIndex === 0}
                className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white text-gray-800 rounded-full p-3 shadow-lg transition-all duration-200 hover:scale-110 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:scale-100 border border-gray-200 z-10"
                aria-label="Imagen anterior"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                onClick={imagenSiguiente}
                disabled={imagenActualIndex === proyecto.imagenes.length - 1}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white text-gray-800 rounded-full p-3 shadow-lg transition-all duration-200 hover:scale-110 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:scale-100 border border-gray-200 z-10"
                aria-label="Siguiente imagen"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>

          {/* Contador */}
          <div className="text-center py-3 text-gray-600 text-sm font-medium border-t border-gray-200 bg-gray-50">
            {imagenActualIndex + 1} / {proyecto.imagenes.length}
          </div>

          {/* Miniaturas */}
          <div className="p-4 border-t border-gray-200 bg-white flex-shrink-0">
            <div className="flex gap-2 overflow-x-auto py-2 scrollbar-thin">
              {proyecto.imagenes.map((imagen, index) => (
                <button
                  key={index}
                  onClick={() => seleccionarImagen(index)}
                  className={`flex-shrink-0 w-16 h-16 rounded-lg border-2 transition-all duration-200 overflow-hidden ${
                    index === imagenActualIndex 
                      ? 'border-blue-500 scale-105 shadow-md' 
                      : 'border-gray-200 hover:border-gray-400 hover:scale-105'
                  }`}
                >
                  <img 
                    src={imagen} 
                    alt={`Miniatura ${index + 1}`}
                    className="w-full h-full object-cover"
                    loading="lazy"
                    onError={(e) => {
                      console.error('Error cargando miniatura:', imagen);
                      e.target.src = '/assets/placeholder-thumb.jpg';
                    }}
                  />
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GalleryModal;