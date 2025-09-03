// App.jsx
import React, { useState, useEffect } from 'react';
import { Header } from './components/layout/Header';
import { Sidebar } from './components/layout/Sidebar';
import { Templates } from './pages/Templates';
import { TemplateForm } from './components/templates/TemplateForm';
import { ConfirmDialog } from './components/ui/ConfirmDialog';
import { SplashScreen } from './components/ui/SplashScreen';
import { useAuth } from './hooks/useAuth';
import { useTemplates } from './hooks/useTemplates';
import { LoadingError } from './components/ui/LoadingError';

function App() {
  // Estados de autenticación y carga
  const { 
    user, 
    loading: authLoading, 
    error: authError, 
    login, 
    register,
    logout,
    canModifyTemplate,
    canViewTemplate 
  } = useAuth();

  const { 
    templates, 
    loading: templatesLoading,
    error: templatesError,
    createTemplate,
    updateTemplate,
    deleteTemplate,
    refreshTemplates
  } = useTemplates(user);

  // Estados de UI
  const [showSplash, setShowSplash] = useState(true);
  const [currentPage, setCurrentPage] = useState('templates');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState(null);
  const [deleteDialog, setDeleteDialog] = useState({ open: false, template: null });
  const [actionLoading, setActionLoading] = useState(false);

  // Manejar splash screen
  useEffect(() => {
    if (!authLoading) {
      // Mostrar splash por al menos 2 segundos
      const timer = setTimeout(() => {
        setShowSplash(false);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [authLoading]);

  // Handlers para plantillas
  const handleCreateTemplate = async (templateData) => {
    try {
      setActionLoading(true);
      
      const templateToCreate = {
        ...templateData,
        author: user.id // Usar el ID del usuario actual
      };
      
      await createTemplate(templateToCreate);
      setCurrentPage('templates');
      
      // Mostrar notificación de éxito (opcional)
      console.log('Plantilla creada exitosamente');
      
    } catch (error) {
      console.error('Error al crear plantilla:', error);
      // Aquí puedes mostrar un toast o modal de error
    } finally {
      setActionLoading(false);
    }
  };

  const handleEditTemplate = async (templateData) => {
    try {
      setActionLoading(true);
      
      await updateTemplate(templateData._id, templateData);
      setEditingTemplate(null);
      setCurrentPage('templates');
      
      console.log('Plantilla actualizada exitosamente');
      
    } catch (error) {
      console.error('Error al actualizar plantilla:', error);
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteTemplate = (template) => {
    // Verificar permisos antes de mostrar el diálogo
    if (canModifyTemplate(template)) {
      setDeleteDialog({ open: true, template });
    } else {
      console.warn('No tienes permisos para eliminar esta plantilla');
      // Mostrar mensaje de error
    }
  };

  const confirmDelete = async () => {
    try {
      setActionLoading(true);
      
      await deleteTemplate(deleteDialog.template._id);
      setDeleteDialog({ open: false, template: null });
      
      console.log('Plantilla eliminada exitosamente');
      
    } catch (error) {
      console.error('Error al eliminar plantilla:', error);
    } finally {
      setActionLoading(false);
    }
  };

  const handleEditClick = (template) => {
    if (canModifyTemplate(template)) {
      setEditingTemplate(template);
      setCurrentPage('edit');
    } else {
      console.warn('No tienes permisos para editar esta plantilla');
    }
  };

  // Handler para login con manejo de errores
  const handleLogin = async (credentials) => {
    try {
      const result = await login(credentials);
      
      if (result.success) {
        console.log('Login exitoso:', result.user.name);
        // Refrescar plantillas después del login
        await refreshTemplates();
        return result;
      } else {
        return result; // Contiene el error
      }
    } catch (error) {
      console.error('Error en login:', error);
      return { success: false, error: 'Error de conexión' };
    }
  };

  // Handler para register
  const handleRegister = async (userData) => {
    try {
      const result = await register(userData);
      
      if (result.success) {
        console.log('Registro exitoso:', result.user.name);
        await refreshTemplates();
        return result;
      } else {
        return result;
      }
    } catch (error) {
      console.error('Error en registro:', error);
      return { success: false, error: 'Error de conexión' };
    }
  };

  // Handler para logout
  const handleLogout = async () => {
    try {
      await logout();
      setCurrentPage('templates'); // Volver a templates
      setEditingTemplate(null); // Limpiar edición
      console.log('Logout exitoso');
    } catch (error) {
      console.error('Error en logout:', error);
    }
  };

  // Función para reintentar conexión
  const handleRetry = () => {
    window.location.reload(); // Recargar la aplicación
  };

  // Renderizado de páginas
  const renderCurrentPage = () => {
    if (templatesLoading && !templates.length) {
      return (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#00A4EF]"></div>
          <span className="ml-3 text-[#546E7A]">Cargando plantillas...</span>
        </div>
      );
    }

    switch (currentPage) {
      case 'create':
        return (
          <TemplateForm
            onSave={handleCreateTemplate}
            onCancel={() => setCurrentPage('templates')}
            loading={actionLoading}
            user={user}
          />
        );
      case 'edit':
        return (
          <TemplateForm
            template={editingTemplate}
            onSave={handleEditTemplate}
            onCancel={() => {
              setEditingTemplate(null);
              setCurrentPage('templates');
            }}
            loading={actionLoading}
            user={user}
          />
        );
      default:
        return (
          <Templates
            user={user}
            templates={templates}
            onEdit={handleEditClick}
            onDelete={handleDeleteTemplate}
            canModifyTemplate={canModifyTemplate}
            canViewTemplate={canViewTemplate}
            loading={templatesLoading}
            error={templatesError}
            onRefresh={refreshTemplates}
          />
        );
    }
  };

  // Mostrar splash screen mientras carga
  if (showSplash || authLoading) {
    return <SplashScreen onComplete={() => setShowSplash(false)} />;
  }

  // Mostrar error si hay problemas críticos
  if (authError && !user) {
    return <LoadingError error={authError} onRetry={handleRetry} />;
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* Header */}
      <Header
        user={user}
        onLogin={handleLogin}
        onRegister={handleRegister}
        onLogout={handleLogout}
        onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        loading={actionLoading}
      />

      <div className="flex">
        {/* Sidebar */}
        <Sidebar
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          currentPage={currentPage}
          onPageChange={setCurrentPage}
          user={user}
        />

        {/* Main Content */}
        <main className="flex-1 lg:ml-0 p-6">
          <div className="max-w-7xl mx-auto">
            {renderCurrentPage()}
          </div>
        </main>
      </div>

      {/* Confirm Dialog */}
      <ConfirmDialog
        isOpen={deleteDialog.open}
        onClose={() => setDeleteDialog({ open: false, template: null })}
        onConfirm={confirmDelete}
        title="Eliminar Plantilla"
        message={`¿Estás seguro de que deseas eliminar la plantilla "${deleteDialog.template?.type}"? Esta acción no se puede deshacer.`}
        type="danger"
        loading={actionLoading}
      />

      {/* Loading overlay para acciones */}
      {actionLoading && (
        <div className="fixed inset-0 bg-black bg-opacity-25 flex items-center justify-center z-50">
          <div className="bg-white rounded-md p-4 flex items-center gap-3 shadow-[0_4px_16px_rgba(0,164,239,0.15)]">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-[#00A4EF]"></div>
            <span className="text-[#263238]">Procesando...</span>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;