# React + TypeScript + Vite - Sistema de Gestión de Usuarios

Este template proporciona una configuración mínima para hacer funcionar React en Vite con HMR y algunas reglas de ESLint, implementando un sistema completo de gestión de usuarios con autenticación y panel administrativo.

## 📋 Descripción de la Aplicación

### Funcionalidades Principales

La aplicación es un **Sistema de Gestión de Usuarios** que ofrece las siguientes características:

#### 🔐 Sistema de Autenticación
- **Login de usuarios**: Ingreso con correo electrónico y contraseña
- **Registro de nuevos usuarios**: Formulario completo con:
  - Nombre y apellido
  - Correo electrónico
  - Contraseña
  - Foto de perfil
- **Validación de credenciales**: Verificación contra la API de usuarios registrados

#### 👥 Gestión de Usuarios desde API
- **Consulta de usuarios**: Obtiene la lista completa de usuarios registrados desde la API
- **Visualización organizada**: Interfaz moderna e intuitiva para mostrar la información
- **Integración con Supabase**: Almacenamiento y gestión de datos de usuarios

#### 🎛️ Panel Administrativo
Una vez autenticado, el usuario accede a un panel completo con las siguientes funciones:

##### Visualización
- **Lista de usuarios**: Muestra todos los usuarios registrados en la plataforma
- **Detalles de usuario**: Selección y visualización detallada de cada usuario
- **Interfaz responsive**: Diseño moderno y adaptable a diferentes dispositivos

##### Operaciones CRUD
- **Crear usuarios**: Formulario para agregar nuevos usuarios con foto de perfil
- **Editar usuarios**: Modificación de información existente:
  - Cambio de foto de perfil
  - Actualización de nombre y apellido
  - Modificación de correo electrónico
- **Eliminar usuarios**: Opción para remover usuarios del sistema

##### Funciones de Búsqueda
- **Búsqueda por nombre**: Filtrado de usuarios por nombre
- **Búsqueda por correo**: Localización rápida mediante correo electrónico
- **Filtros dinámicos**: Actualización en tiempo real de resultados

#### 🔄 Flujo de Usuario
1. **Acceso inicial**: El usuario puede elegir entre login o registro
2. **Registro**: Si es nuevo, completa el formulario con sus datos y foto
3. **Login**: Ingresa con correo y contraseña registrados
4. **Dashboard**: Accede al panel administrativo con todas las funcionalidades
5. **Gestión**: Puede ver, crear, editar, eliminar y buscar usuarios
6. **Persistencia**: 

## 🚀 Despliegue y Configuración

### Prerrequisitos
- Node.js (versión 18 o superior)
- npm o yarn

### Variables de Entorno

Crea un archivo `.env` en la raíz del proyecto con las siguientes variables:

```env
VITE_URL_API=https://reqres.in
VITE_key_supabase=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImludnV5bHV2a2hudnV4dHdobXhpIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0ODMxNTU1OCwiZXhwIjoyMDYzODkxNTU4fQ.2-RQyVFOdIlyc3MDzLfBL2_Gyn-VD24kr1DrExksUV0
VITE_URL_SUPABASE=https://invuyluvkhnvuxtwhmxi.supabase.co
```

> **Nota:** Agrega `.env` a tu archivo `.gitignore` para evitar subir credenciales al repositorio.

### Instalación y Ejecución

1. **Instalar dependencias:**
   ```bash
   npm install
   # o
   yarn install
   ```

2. **Ejecutar en modo desarrollo:**
   ```bash
   npm run dev
   # o
   yarn dev
   ```
   La aplicación estará disponible en `http://localhost:5173`

3. **Construir para producción:**
   ```bash
   npm run build
   # o
   yarn build
   ```

4. **Vista previa de la build de producción:**
   ```bash
   npm run preview
   # o
   yarn preview
   ```

5. **Ejecutar linting:**
   ```bash
   npm run lint
   # o
   yarn lint
   ```

### Scripts Disponibles

- `dev`: Inicia el servidor de desarrollo
- `build`: Construye la aplicación para producción
- `lint`: Ejecuta ESLint en el código
- `preview`: Sirve la build de producción localmente

## 🛠️ Tecnologías Utilizadas

- **Frontend**: React 18 + TypeScript
- **Build Tool**: Vite
- **Base de Datos**: Supabase
- **API Externa**: ReqRes (para usuarios de prueba)
- **Estilos**: CSS moderno con diseño responsive
- **Autenticación**: Sistema custom con validación

## 🔧 Plugins Oficiales

Actualmente, dos plugins oficiales están disponibles:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) usa [Babel](https://babeljs.io/) para Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) usa [SWC](https://swc.rs/) para Fast Refresh

## 📋 Configuración de ESLint Avanzada

Si estás desarrollando una aplicación para producción, recomendamos actualizar la configuración para habilitar reglas de lint con conocimiento de tipos:

```js
export default tseslint.config([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Otras configuraciones...
      // Remover tseslint.configs.recommended y reemplazar con esto
      ...tseslint.configs.recommendedTypeChecked,
      // Alternativamente, usar esto para reglas más estrictas
      ...tseslint.configs.strictTypeChecked,
      // Opcionalmente, agregar esto para reglas de estilo
      ...tseslint.configs.stylisticTypeChecked,
      
      // Otras configuraciones...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // otras opciones...
    },
  },
])
```

También puedes instalar [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) y [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) para reglas de lint específicas de React:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default tseslint.config([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Otras configuraciones...
      // Habilitar reglas de lint para React
      reactX.configs['recommended-typescript'],
      // Habilitar reglas de lint para React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // otras opciones...
    },
  },
])
```

## 🌐 Despliegue

### Netlify
1. Conecta tu repositorio a Netlify
2. Configura las variables de entorno en el panel de Netlify
3. Comando de build: `npm run build`
4. Directorio de publicación: `dist`

### Vercel
1. Conecta tu repositorio a Vercel
2. Configura las variables de entorno en el panel de Vercel
3. Vercel detectará automáticamente que es un proyecto Vite

### GitHub Pages
```bash
npm run build
# Sube el contenido de la carpeta dist/
```

## 📸 Capturas de Pantalla

> **Próximamente**: Agrega capturas de pantalla de la aplicación mostrando el login, registro, panel administrativo y funciones de gestión de usuarios.

## 🤝 Contribución

Si deseas contribuir al proyecto:

1. Fork el repositorio
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

---

¡Tu aplicación React + TypeScript + Vite con Sistema de Gestión de Usuarios está lista para correr! 🎉