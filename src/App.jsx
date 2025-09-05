// App.jsx - Actualizado con funcionalidad de contactos
import React, { useState, useEffect } from 'react';
import { Header } from './components/layout/Header';
import { Sidebar } from './components/layout/Sidebar';
import { Templates } from './pages/Templates';
import { Contacts } from './pages/Contacts';
import { TemplateForm } from './components/templates/TemplateForm';
import { ContactForm } from './components/contacts/ContactForm';
import { ConfirmDialog } from './components/ui/ConfirmDialog';
import { SplashScreen } from './components/ui/SplashScreen';
import { LoadingError } from './components/ui/LoadingError';
import { useAuth } from './hooks/useAuth';
import { useTemplates } from './hooks/useTemplates';
import { useContacts } from './hooks/useContacts';
import { notify } from './utils/notify';
import { Toaster } from 'sonner';

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

  const {
    contacts,
    loading: contactsLoading,
    error: contactsError,
    createContact,
    deleteContact: removeContact,
    refreshContacts,
    canCreateContact,
    canDeleteContact
  } = useContacts(user);

  // Estados de UI
  const [showSplash, setShowSplash] = useState(true);
  const [currentPage, setCurrentPage] = useState('templates');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState(null);
  const [deleteDialog, setDeleteDialog] = useState({ open: false, item: null, type: null });
  const [actionLoading, setActionLoading] = useState(false);

  // Manejar splash screen
  useEffect(() => {
    if (!authLoading) {
      const timer = setTimeout(() => {
        setShowSplash(false);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [authLoading]);

  // === HANDLERS PARA PLANTILLAS ===
  const handleCreateTemplate = async (templateData) => {
    try {
      setActionLoading(true);
      const templateToCreate = {
        ...templateData,
        author: user.id
      };
      await createTemplate(templateToCreate);
      setCurrentPage('templates');
      notify.success('Plantilla creada exitosamente');
    } catch (error) {
      notify.error('Error al crear la plantilla');
      console.error('Error al crear plantilla:', error);
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
      notify.success('Plantilla actualizada exitosamente');
    } catch (error) {
      notify.error('Error al editar la plantilla');
      console.error('Error al actualizar plantilla:', error);
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteTemplate = (template) => {
    if (canModifyTemplate(template)) {
      setDeleteDialog({ open: true, item: template, type: 'template' });
    } else {
      notify.info('No tienes permisos para eliminar esta plantilla');
    }
  };

  const handleEditClick = (template) => {
    if (canModifyTemplate(template)) {
      setEditingTemplate(template);
      setCurrentPage('edit');
    } else {
      notify.info('No tienes permisos para editar esta plantilla');
    }
  };

  // === HANDLERS PARA CONTACTOS ===
  const handleCreateContact = async (contactData) => {
    try {
      setActionLoading(true);
      const result = await createContact(contactData);
      
      if (result.success) {
        setCurrentPage('contacts');
        notify.success('Contacto creado exitosamente');
      } else {
        if (result.type === 'duplicate') {
          notify.error('Ya existe un contacto con ese número de WhatsApp');
        } else {
          notify.error(result.error || 'Error al crear el contacto');
        }
      }
    } catch (error) {
      notify.error('Error al crear el contacto');
      console.error('Error al crear contacto:', error);
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteContact = (contact) => {
    if (canDeleteContact(contact)) {
      setDeleteDialog({ open: true, item: contact, type: 'contact' });
    } else {
      notify.info('No tienes permisos para eliminar este contacto');
    }
  };

  // === CONFIRMACIÓN DE ELIMINACIÓN ===
  const confirmDelete = async () => {
    try {
      setActionLoading(true);
      
      if (deleteDialog.type === 'template') {
        await deleteTemplate(deleteDialog.item._id);
        notify.success('Plantilla eliminada exitosamente');
      } else if (deleteDialog.type === 'contact') {
        const result = await removeContact(deleteDialog.item.id);
        if (result.success) {
          notify.success('Contacto eliminado exitosamente');
        } else {
          notify.error(result.error || 'Error al eliminar el contacto');
        }
      }

      setDeleteDialog({ open: false, item: null, type: null });
    } catch (error) {
      const itemType = deleteDialog.type === 'template' ? 'plantilla' : 'contacto';
      notify.error(`Error al eliminar ${itemType}`);
      console.error(`Error al eliminar ${itemType}:`, error);
    } finally {
      setActionLoading(false);
    }
  };

  // === HANDLERS DE AUTENTICACIÓN ===
  const handleLogin = async (credentials) => {
    try {
      const result = await login(credentials);
      
      if (result.success) {
        await Promise.all([refreshTemplates(), refreshContacts()]);
        notify.success(`Bienvenido ${result.user.name}!`);
        return result;
      } else {
        switch (result.tipo) {
          case "username":
            notify.error("Usuario no encontrado");
            break;
          case "password":
            notify.error("Contraseña incorrecta");
            break;
          default:
            notify.error(result.message || "Error en el login");
        }
        return result;
      }
    } catch (error) {
      console.error('Error en login:', error);
      notify.error("Error de conexión con el servidor");
      return { success: false, error: 'Error de conexión' };
    }
  };

  const handleRegister = async (userData) => {
    try {
      const result = await register(userData);
      
      if (result.success) {
        await Promise.all([refreshTemplates(), refreshContacts()]);
        notify.success(`Registro exitoso: ${result.user.name}`);
        return result;
      } else {
        return result;
      }
    } catch (error) {
      notify.error("Error de conexión con el servidor");
      console.error('Error en registro:', error);
      return { success: false, error: 'Error de conexión' };
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      setCurrentPage('templates');
      setEditingTemplate(null);
      notify.success('Logout exitoso');
    } catch (error) {
      console.error('Error en logout:', error);
      notify.error("Error de conexión con el servidor");
    }
  };

  // === RENDERIZADO DE PÁGINAS ===
  const renderCurrentPage = () => {
    // Loading state general
    const isInitialLoading = (templatesLoading && !templates.length) || 
                            (contactsLoading && !contacts.length && currentPage === 'contacts');

    if (isInitialLoading) {
      return (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#00A4EF]"></div>
          <span className="ml-3 text-[#546E7A]">
            {currentPage === 'contacts' ? 'Cargando contactos...' : 'Cargando plantillas...'}
          </span>
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

      case 'contacts':
        return (
          <Contacts
            user={user}
            contacts={contacts}
            onCreateContact={() => setCurrentPage('create-contact')}
            onDelete={handleDeleteContact}
            loading={contactsLoading}
            error={contactsError}
            onRefresh={refreshContacts}
            canCreateContact={canCreateContact()}
          />
        );

      case 'create-contact':
        return (
          <ContactForm
            onSave={handleCreateContact}
            onCancel={() => setCurrentPage('contacts')}
            loading={actionLoading}
            user={user}
          />
        );

      default: // templates
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

  // Función para reintentar conexión
  const handleRetry = () => {
    window.location.reload();
  };

  // Mostrar splash screen mientras carga
  if (showSplash || authLoading) {
    return <SplashScreen onComplete={() => setShowSplash(false)} />;
  }

  // Mostrar error si hay problemas críticos
  if (authError && !user) {
    return <LoadingError error={authError} onRetry={handleRetry} />;
  }

  // Mensaje del diálogo de confirmación
  const getDeleteMessage = () => {
    if (deleteDialog.type === 'template') {
      return `¿Estás seguro de que deseas eliminar la plantilla "${deleteDialog.item?.type}"? Esta acción no se puede deshacer.`;
    } else if (deleteDialog.type === 'contact') {
      return `¿Estás seguro de que deseas eliminar el contacto "${deleteDialog.item?.name}"? Esta acción no se puede deshacer.`;
    }
    return '';
  };

  const getDeleteTitle = () => {
    return deleteDialog.type === 'template' ? 'Eliminar Plantilla' : 'Eliminar Contacto';
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <Toaster richColors position="top-center" />

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
        onClose={() => setDeleteDialog({ open: false, item: null, type: null })}
        onConfirm={confirmDelete}
        title={getDeleteTitle()}
        message={getDeleteMessage()}
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