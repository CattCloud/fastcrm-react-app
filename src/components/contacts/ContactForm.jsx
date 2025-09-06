// src/components/contacts/ContactForm.jsx
import { useState } from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { X, User, Phone, Loader2,Building } from 'lucide-react';
import { CompanyInput } from '../ui/CompanyInput';
import { useCompany } from '../../hooks/useCompany';

export const ContactForm = ({ onSave, onCancel, loading = false, user }) => {
  const [formData, setFormData] = useState({
    name: '',
    whatsapp: '',
    company: '',
    ruc: ''

  });
  const [errors, setErrors] = useState({});
  const { companies, createCompany } = useCompany(); // ← Asegúrate de incluir createCompany

  const companySuggestions = companies.map(c => c.name);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'El nombre es requerido';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'El nombre debe tener al menos 2 caracteres';
    }

    const phoneRegex = /^\+51\d{9}$/;
    if (!formData.whatsapp.trim()) {
      newErrors.whatsapp = 'El número de WhatsApp es requerido';
    } else if (!phoneRegex.test(formData.whatsapp.trim())) {
      newErrors.whatsapp = 'Formato de número inválido (ej: +51987654321)';
    }

    if (formData.company.trim()) {
      const matchedCompany = companies.find(
        c => c.name.toLowerCase() === formData.company.trim().toLowerCase()
      );

      if (!matchedCompany) {
        if (!formData.ruc.trim()) {
          newErrors.ruc = 'El RUC es requerido';
        } else if (!/^\d{11}$/.test(formData.ruc.trim())) {
          newErrors.ruc = 'El RUC debe tener exactamente 11 dígitos';
        }
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const contactData = {
      name: formData.name.trim(),
      whatsapp: formData.whatsapp.trim(),
      authorId: user.id
    };

    const companyName = formData.company.trim();
    if (companyName) {
      const matchedCompany = companies.find(
        c => c.name.toLowerCase() === companyName.toLowerCase()
      );

      if (matchedCompany) {
        contactData.companyId = matchedCompany.id;
      } else {
        const result = await createCompany({
          name: companyName,
          ruc: formData.ruc.trim()
        });

        if (result.success) {
          contactData.companyId = result.company.id;
        } else {
          console.error('Error al crear empresa:', result.error);
          return;
        }
      }
    }

    onSave(contactData);
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => {
      const updated = { ...prev, [field]: value };

      if (field === 'company') {
        const match = companies.find(
          c => c.name.toLowerCase() === value.trim().toLowerCase()
        );
        updated.ruc = match ? match.ruc : '';
      }

      return updated;
    });

    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };


  return (
    <div className="w-full mx-auto">
      <Card className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#E3F2FD] rounded-lg flex items-center justify-center">
              <User className="w-5 h-5 text-[#00A4EF]" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-[#263238]">
                Nuevo Contacto
              </h2>
              <p className="text-sm text-[#546E7A]">
                Registra un nuevo contacto en tu directorio
              </p>
            </div>
          </div>

        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Campo Nombre */}
          <div>
            <label className="block text-sm font-medium text-[#263238] mb-2">
              Nombre completo *
            </label>
            <div className="relative">
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                className={`
                  w-full px-4 py-2 pl-10 border rounded-md text-[#263238]
                  transition-all duration-200 ease-[cubic-bezier(0.4,0,0.2,1)]
                  focus:outline-none focus:ring-3 focus:ring-[rgba(0,164,239,0.1)]
                  ${errors.name
                    ? 'border-[#F44336] bg-red-50'
                    : 'border-[#E3F2FD] focus:border-[#00A4EF] bg-white'
                  }
                `}
                placeholder="Ej: Juan Pérez García"
                disabled={loading}
              />
              <User
                className={`absolute left-3 top-2.5 w-4 h-4 ${errors.name ? 'text-[#F44336]' : 'text-[#90A4AE]'}`}
              />
            </div>
            {errors.name && (
              <p className="mt-1 text-sm text-[#F44336]">{errors.name}</p>
            )}
          </div>

          {/* Campo WhatsApp */}
          <div>
            <label className="block text-sm font-medium text-[#263238] mb-2">
              Número de WhatsApp *
            </label>
            <div className="relative">
              <input
                type="tel"
                value={formData.whatsapp}
                onChange={(e) => handleInputChange('whatsapp', e.target.value)}
                className={`
                  w-full px-4 py-2 pl-10 border rounded-md text-[#263238]
                  transition-all duration-200 ease-[cubic-bezier(0.4,0,0.2,1)]
                  focus:outline-none focus:ring-3 focus:ring-[rgba(0,164,239,0.1)]
                  ${errors.whatsapp
                    ? 'border-[#F44336] bg-red-50'
                    : 'border-[#E3F2FD] focus:border-[#00A4EF] bg-white'
                  }
                `}
                placeholder="Ej: +51987654321"
                disabled={loading}
              />
              <Phone
                className={`absolute left-3 top-2.5 w-4 h-4 ${errors.whatsapp ? 'text-[#F44336]' : 'text-[#90A4AE]'}`}
              />
            </div>
            {errors.whatsapp && (
              <p className="mt-1 text-sm text-[#F44336]">{errors.whatsapp}</p>
            )}
            <p className="mt-1 text-xs text-[#90A4AE]">
              Incluye el código de país +51
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-[#263238] mb-2">
              Empresa (opcional)
            </label>
            <CompanyInput
              value={formData.company}
              onChange={(value) => handleInputChange('company', value)}
              suggestions={companySuggestions}
              disabled={loading}
            />
          </div>
          

          {!companies.some(c => c.name.toLowerCase() === formData.company.trim().toLowerCase()) && (
            <div>
              <label className="block text-sm font-medium text-[#263238] mb-2">
                RUC de la empresa *
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={formData.ruc}
                  onChange={(e) => handleInputChange('ruc', e.target.value)}
                  className={`
                  w-full px-4 py-2 pl-10 border rounded-md text-[#263238]
                  transition-all duration-200 ease-[cubic-bezier(0.4,0,0.2,1)]
                  focus:outline-none focus:ring-3 focus:ring-[rgba(0,164,239,0.1)]
                  ${errors.ruc
                      ? 'border-[#F44336] bg-red-50'
                      : 'border-[#E3F2FD] focus:border-[#00A4EF] bg-white'
                    }
                `}
                  placeholder="Ej: 20512345678"
                  disabled={loading}
                />
                <Building
                className={`absolute left-3 top-2.5 w-4 h-4 ${errors.whatsapp ? 'text-[#F44336]' : 'text-[#90A4AE]'}`}
              />
              </div>
              {errors.ruc && (
                <p className="mt-1 text-sm text-[#F44336]">{errors.ruc}</p>
              )}
            </div>
          )}


          {/* Información del autor */}
          <div className="bg-[#F8FAFC] border border-[#E3F2FD] rounded-md p-3">
            <p className="text-sm text-[#546E7A]">
              <span className="font-medium">Registrado por:</span> {user.name}
            </p>
          </div>

          {/* Botones de acción */}
          <div className="flex gap-3 pt-2">
            <Button
              type="button"
              variant="secondary"
              onClick={onCancel}
              disabled={loading}
              className="flex-1"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="flex-1 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Guardando...
                </>
              ) : (
                'Guardar Contacto'
              )}
            </Button>
          </div>
        </form>

        {/* Nota sobre duplicados */}
        <div className="mt-4 p-3 bg-[#E3F2FD] border border-[#BBDEFB] rounded-md">
          <p className="text-xs text-[#0D47A1]">
            <span className="font-medium">Nota:</span> No se permiten números de WhatsApp duplicados
            para el mismo usuario.
          </p>
        </div>
      </Card>
    </div>
  );
};