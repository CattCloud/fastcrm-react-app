# FastCRM - Frontend React App
Sistema de gestión de relaciones con clientes (CRM) desarrollado con React y Tailwind CSS. Interfaz moderna y responsiva para la gestión completa de plantillas, contactos, empresas y logs de comunicación.

## Deploy

🌐 **[Ver Pagina Web](https://fastcrm-react-app-production.up.railway.app/)** - Deploy en Netlify

## Tabla de Contenidos

- [Tecnologías Utilizadas](#-tecnologías-utilizadas)
- [Funcionalidades](#-funcionalidades)
- [Instalación Local](#-instalación-local)
- [Estructura del Proyecto](#-estructura-del-proyecto)
- [Decisiones Técnicas](#-decisiones-técnicas)
- [Funcionalidades Extra](#-funcionalidades-extra)
- [Variables de Entorno](#-variables-de-entorno)
- [Scripts Disponibles](#-scripts-disponibles)

## Tecnologías Utilizadas

### Core Technologies
- **React 18** - Framework principal
- **Vite** - Build tool y dev server ultrarrápido
- **JavaScript (ES6+)** - Lenguaje principal

### Styling & UI
- **Tailwind CSS 4** - Framework CSS utilitario
- **Lucide React** - Librería de iconos moderna
- **Sonner** - Sistema de notificaciones toast

### State Management & Hooks
- **Custom Hooks** - Gestión de estado con hooks personalizados
- **LocalStorage** - Persistencia de datos del usuario
- **React Hooks** - useState, useEffect, useMemo, etc.

### HTTP Client & Services
- **Fetch API** - Cliente HTTP nativo
- **Service Layer** - Arquitectura de servicios modulares

## Funcionalidades

### Sistema de Autenticación
- **Login/Registro** con validación en tiempo real
- **Roles de Usuario**: Admin, Usuario, Invitado
- **Persistencia de sesión** con LocalStorage
- **Logout** con limpieza de datos

### Gestión de Plantillas
- **CRUD completo** de plantillas de mensajes
- **Preview en tiempo real** mientras se edita
- **Búsqueda avanzada** por contenido y filtros
- **Etiquetas dinámicas** con autocompletado
- **Variables dinámicas** `{{nombre}}` `{{proyecto}}`

### Gestión de Contactos
- **Registro de contactos** con validación de WhatsApp
- **Asociación con empresas**
- **Búsqueda y filtrado** por nombre y teléfono
- **Vista responsiva** con cards adaptables

### Gestión de Empresas
- **Creación de empresas** con RUC
- **Relación 1:N** empresa-contactos
- **Vista jerárquica** de empresas y sus contactos

### Historial de Comunicaciones
- **Logs de contacto** con detalles completos
- **Tracking de plantillas** utilizadas
- **Histórico por usuario** y global (admin)
- **Vista cronológica** ordenable

## Instalación Local

### Prerrequisitos
- Node.js 18+ 
- npm o yarn
- FastCRM Express API corriendo

### Pasos de Instalación

```bash
# 1. Clonar el repositorio
git clone https://github.com/CattCloud/fastcrm-react-app
cd fastcrm-react-app

# 2. Instalar dependencias
npm install

# 3. Configurar variables de entorno
cp .env.example .env.local

# 4. Iniciar servidor de desarrollo
npm run dev
```

La aplicación estará disponible en `http://localhost:5173`

## Estructura del Proyecto

```
src/
├── components/           # Componentes reutilizables
│   ├── layout/          # Layout y navegación
│   │   ├── Header.jsx   # Barra superior con auth
│   │   ├── Sidebar.jsx  # Navegación lateral
│   │   └── Layout.jsx   # Layout principal
│   ├── ui/              # Componentes base UI
│   │   ├── Button.jsx   # Botón personalizado
│   │   ├── Card.jsx     # Tarjetas contenedoras
│   │   ├── Modal.jsx    # Modales y diálogos
│   │   ├── Badge.jsx    # Etiquetas y badges
│   │   └── Input.jsx    # Campos de formulario
│   ├── templates/       # Componentes de plantillas
│   ├── contacts/        # Componentes de contactos
│   └── companies/       # Componentes de empresas
├── pages/               # Páginas principales
│   ├── Templates.jsx    # Gestión de plantillas
│   ├── Contacts.jsx     # Gestión de contactos
│   ├── Companies.jsx    # Gestión de empresas
│   └── ContactsLog.jsx  # Historial de comunicaciones
├── hooks/               # Custom hooks
│   ├── useAuth.js       # Hook de autenticación
│   ├── useTemplates.js  # Hook de plantillas
│   ├── useContacts.js   # Hook de contactos
│   └── useLocalStorage.js # Hook de persistencia
├── services/            # Servicios API
│   ├── authService.js   # Servicio de autenticación
│   ├── templateService.js # Servicio de plantillas
│   ├── contactService.js  # Servicio de contactos
│   └── searchService.js   # Servicio de búsquedas
├── utils/               # Utilidades
│   ├── constants.js     # Constantes de la app
│   ├── validators.js    # Validadores de formularios
│   └── notify.js        # Sistema de notificaciones
└── App.jsx             # Componente principal
```

## Decisiones Técnicas Clave

### 1. **Arquitectura de Hooks Personalizados**
- **Separación de responsabilidades**: Cada entidad tiene su hook dedicado
- **Estado global distribuido**: Sin necesidad de Redux/Zustand
- **Reutilización**: Hooks compartibles entre componentes

### 2. **Sistema de Servicios Modulares**
```javascript
// Ejemplo: templateService.js
export const templateService = {
  fetchAllTemplates,
  createTemplate,
  updateTemplate,
  deleteTemplate
};
```

### 3. **Conversión de Datos API ↔ Frontend**
```javascript
const convertApiTemplateToAppTemplate = (apiTemplate) => {
  // Normalización consistente de datos
  return {
    _id: apiTemplate._id,
    type: apiTemplate.type,
    // ... transformación específica
  };
};
```

### 4. **Sistema de Roles Granular**
- **Invitado**: Solo ve plantillas públicas
- **Usuario**: CRUD de sus propios recursos  
- **Admin**: Acceso completo al sistema

### 5. **Tailwind CSS con Variables CSS Customizadas**
```css
:root {
  --color-primary: #00A4EF;
  --shadow-tech: 0 2px 8px rgba(0, 164, 239, 0.08);
  --transition-tech: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}
```

### 6. **Diseño Mobile-First Responsivo**
- **Breakpoints**: sm, md, lg, xl
- **Sidebar adaptable**: Overlay en móvil, fijo en desktop
- **Cards responsivas**: Grid adaptable según pantalla

## Funcionalidades Extra Implementadas

### 1. **Sistema de Búsqueda Avanzada**
```javascript
// Búsqueda con operadores MongoDB desde el frontend
const searchTemplates = async (keyword, type, role) => {
  // Implementación con regex y filtros combinados
};
```

### 2. **Preview en Tiempo Real**
- **Vista dual**: Formulario | Preview
- **Variables dinámicas**: Reemplazo automático de `{{variables}}`
- **Actualización instantánea** al escribir

### 3. **Tags Input con Autocompletado**
- **Sugerencias inteligentes** basadas en tags existentes
- **Validación de duplicados**
- **UX fluida** con keyboard navigation

### 4. **Sistema de Notificaciones**
```javascript
import { notify } from './utils/notify';

// Diferentes tipos de notificaciones
notify.success('Plantilla creada exitosamente');
notify.error('Error al conectar con el servidor');
notify.promise(promiseAction, { loading, success, error });
```

### 5. **Loading States Granulares**
- **Skeleton screens** para mejor UX
- **Loading spinners** contextuales
- **Estados de error** con retry options

### 6. **Persistencia Inteligente**
- **Auto-save** de borradores (localStorage)
- **Recuperación de sesión** después de refresh
- **Cleanup automático** al hacer logout

### 7. **Validaciones en Tiempo Real**
- **Formularios reactivos** con feedback inmediato
- **Validación de WhatsApp** formato peruano
- **Variables de plantilla** con syntax highlighting

### 8. **Dashboard con Estadísticas**
- **Contadores dinámicos** de recursos
- **Filtros temporales** (hoy, semana, mes)
- **Vista por usuario** vs vista global

##  Variables de Entorno

Crear archivo `.env.local`:

```env
# URL del backend API
VITE_APP_API_URL=http://localhost:3000/api


## Scripts Disponibles

```bash
# Desarrollo
npm run dev          # Iniciar servidor de desarrollo

# Build
npm run build        # Crear build de producción
npm run preview      # Preview del build localmente

```

### Variables de Entorno en Deploy

Configurar en tu plataforma de deploy:
- `VITE_APP_API_URL`: URL de tu backend en producción

## Enlaces Relacionados

- **[FastCRM Express API](https://github.com/CattCloud/fastcrm-express-api)** - Backend del sistema
