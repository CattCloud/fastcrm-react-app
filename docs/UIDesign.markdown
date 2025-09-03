# FastCRM - Sistema de Diseño y Estructura

## 🎨 Variables CSS con Paleta ESET Tech

```css
@import "tailwindcss";

:root {
  font-family: "Inter", sans-serif;
}

@theme {
  /* Colores principales */
  --color-primary: #00A4EF;
  --color-secondary: #0D47A1;
  --color-accent: #00E676;
  --color-warning: #FF9800;
  --color-error: #F44336;
  
  /* Colores de fondo */
  --color-bg-primary: #F8FAFC;
  --color-bg-secondary: #FFFFFF;
  --color-bg-accent: #E3F2FD;
  
  /* Colores de texto */
  --color-text-primary: #263238;
  --color-text-secondary: #546E7A;
  --color-text-muted: #90A4AE;
  
  /* Bordes */
  --color-border: #E3F2FD;
  --color-border-hover: #BBDEFB;
  
  /* Sombras tech */
  --shadow-tech: 0 2px 8px rgba(0, 164, 239, 0.08);
  --shadow-tech-hover: 0 4px 16px rgba(0, 164, 239, 0.15);
  --shadow-tech-focus: 0 0 0 3px rgba(0, 164, 239, 0.1);
  
  /* Transiciones precisas */
  --transition-tech: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}
```

## 📁 Estructura de Archivos MVC

```
src/
├── components/
│   ├── layout/
│   │   ├── Sidebar.jsx
│   │   ├── Header.jsx
│   │   └── Layout.jsx
│   ├── ui/
│   │   ├── Button.jsx
│   │   ├── Input.jsx
│   │   ├── Modal.jsx
│   │   ├── Card.jsx
│   │   ├── Badge.jsx
│   │   ├── TagsInput.jsx
│   │   ├── LoadingSkeleton.jsx
│   │   └── ConfirmDialog.jsx
│   └── templates/
│       ├── TemplateCard.jsx
│       ├── TemplateForm.jsx
│       └── TemplatePreview.jsx
├── pages/
│   ├── Templates.jsx
│   ├── CreateTemplate.jsx
│   └── EditTemplate.jsx
├── services/
│   ├── templateService.js
│   └── authService.js
├── hooks/
│   ├── useAuth.js
│   ├── useTemplates.js
│   └── useLocalStorage.js
├── utils/
│   ├── constants.js
│   ├── validators.js
│   └── helpers.js
├── App.jsx
└── main.jsx
```

## 🎯 Componentes Principales

### 1. Layout con Sidebar Fijo

**Desktop:**
```
┌─────────────┬───────────────────────────────┐
│   SIDEBAR   │         HEADER                │
│             ├───────────────────────────────┤
│   Menu      │                               │
│   Items     │         MAIN CONTENT          │
│             │                               │
│             │                               │
└─────────────┴───────────────────────────────┘
```

**Mobile:**
```
┌─────────────────────────────────────────┐
│  HEADER (Hamburger + User Status)      │
├─────────────────────────────────────────┤
│                                         │
│            MAIN CONTENT                 │
│                                         │
└─────────────────────────────────────────┘
```

### 2. Header con Estado de Usuario

```
┌─────────────────────────────────────────────────────┐
│ [☰] FastCRM          [🔄] INVITADO [Iniciar Sesión] │
└─────────────────────────────────────────────────────┘
```

### 3. Template Cards con Acciones

```
┌─────────────────────────────────────┐
│ [Type Badge]           [⋯] Actions  │
│ Template Content Preview...         │
│ ┌─────┐ ┌─────────┐ ┌──────────┐    │
│ │ tag1│ │ tag2    │ │ tag3     │    │
│ └─────┘ └─────────┘ └──────────┘    │
│ Por: Usuario | Hace 2 días          │
└─────────────────────────────────────┘
```

## 🔧 Funcionalidades Específicas

### Sistema de Roles
- **INVITADO** (por defecto): Ve solo plantillas de invitado
- **USUARIO** (localStorage): Ve sus plantillas
- **ADMIN**: Ve todas las plantillas

### Formulario con Preview en Tiempo Real
```
┌─────────────────┬─────────────────┐
│   FORMULARIO    │     PREVIEW     │
│                 │                 │
│ Type: [select]  │ Hola Juan,      │
│ Content: [...]  │ bienvenido al   │
│ Labels: [chips] │ equipo...       │
│                 │                 │
└─────────────────┴─────────────────┘
```

### Tags Input con Autocompletado
```
┌─────────────────────────────────────────┐
│ [bienvenida] [urgente] [desarrollo] [+] │
│ ┌─────────────────────────────────────┐ │
│ │ Sugerencias:                        │ │
│ │ • seguimiento                       │ │
│ │ • confirmación                      │ │
│ └─────────────────────────────────────┘ │
└─────────────────────────────────────────┘
```

## 🎨 Elementos de Diseño Sharp Tech

### Buttons
```css
/* Primary Button */
.btn-primary {
  background: var(--color-primary);
  border-radius: 6px;
  box-shadow: var(--shadow-tech);
  transition: var(--transition-tech);
}

.btn-primary:hover {
  box-shadow: var(--shadow-tech-hover);
  transform: translateY(-1px);
}
```

### Cards
```css
.card-tech {
  background: var(--color-bg-secondary);
  border: 1px solid var(--color-border);
  border-radius: 6px;
  box-shadow: var(--shadow-tech);
  transition: var(--transition-tech);
}

.card-tech:hover {
  box-shadow: var(--shadow-tech-hover);
  border-color: var(--color-border-hover);
}
```

### Loading States
- **Skeleton**: Para cards de plantillas
- **Spinner**: Para navegación entre páginas
- **Progress**: Para formularios largos

## 📱 Responsive Breakpoints

```css
/* Mobile First Approach */
.container {
  @media (min-width: 640px) { /* sm */ }
  @media (min-width: 768px) { /* md */ }
  @media (min-width: 1024px) { /* lg - Sidebar visible */ }
  @media (min-width: 1280px) { /* xl */ }
}
```

## 🚦 Estados y Validaciones

### Formulario
- **Campos requeridos**: Border rojo + mensaje
- **Validación en tiempo real**: Para variables `{{nombre}}`
- **Preview dinámico**: Actualización instantánea

### Confirmaciones
- **Eliminar**: Modal con botón rojo
- **Editar**: Modal informativo
- **Logout**: Confirmación simple

