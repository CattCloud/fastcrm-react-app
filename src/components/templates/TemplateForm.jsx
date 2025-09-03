import { useState, useEffect } from 'react';
import { TEMPLATE_TYPES, SUGGESTED_TAGS } from '../../utils/constants';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { TagsInput } from '../ui/TagsInput';

// Componente TemplateForm 
export const TemplateForm = ({ template, onSave, onCancel }) => {
    const [formData, setFormData] = useState({
        type: template?.type || 'bienvenida',
        content: template?.content || '',
        labels: template?.labels || []
    });

    const [previewData, setPreviewData] = useState({});

    const handleSubmit = (e) => {
        e.preventDefault();
        if (formData.content.trim()) {
            onSave({
                ...template,
                ...formData,
                _id: template?._id || Date.now().toString()
            });
        }
    };

    useEffect(() => {
        const variablesDetectadas = detectarVariables(formData.content);
        const nuevasVariables = {};
        variablesDetectadas.forEach((key) => {
            if (!(key in previewData)) {
                nuevasVariables[key] = '';
            }
        });

        const previewFiltrado = Object.fromEntries(
            Object.entries(previewData).filter(([key]) => variablesDetectadas.includes(key))
        );

        setPreviewData({ ...previewFiltrado, ...nuevasVariables });
    }, [formData.content]);

    const detectarVariables = (content) => {
        const matches = content.match(/{{\s*[\w.-]+\s*}}/g); // solo palabras válidas
        if (!matches) return [];
        return [...new Set(
            matches
                .map(v => v.replace(/[{}]/g, '').trim())
                .filter(v => v.length > 0)
        )];
    };


    const renderPreview = () => {
        let content = formData.content;

        const variablesDetectadas = detectarVariables(content);

        variablesDetectadas.forEach((key) => {
            const valor = previewData[key];
            const reemplazo = valor?.trim() ? valor : `{{${key}}}`;
            content = content.replace(new RegExp(`{{\\s*${key}\\s*}}`, 'g'), reemplazo);
        });

        return content;
    };
    return (
        <div className="max-w-6xl mx-auto">
            <form onSubmit={handleSubmit} className="grid lg:grid-cols-2 gap-6">
                {/* Formulario */}
                <Card className="p-6">
                    <h2 className="text-xl font-semibold text-[#263238] mb-4">
                        {template ? 'Editar Plantilla' : 'Nueva Plantilla'}
                    </h2>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-[#263238] mb-1">
                                Tipo *
                            </label>
                            <select
                                value={formData.type}
                                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                                className="w-full px-3 py-2 border border-[#E3F2FD] rounded-md focus:outline-none focus:ring-3 focus:ring-[rgba(0,164,239,0.1)] focus:border-[#00A4EF]"
                                required
                            >
                                {TEMPLATE_TYPES.map(type => (
                                    <option key={type} value={type}>
                                        {type.charAt(0).toUpperCase() + type.slice(1)}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-[#263238] mb-1">
                                Contenido *
                            </label>
                            <textarea
                                value={formData.content}
                                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                                className="w-full px-3 py-2 border border-[#E3F2FD] rounded-md focus:outline-none focus:ring-3 focus:ring-[rgba(0,164,239,0.1)] focus:border-[#00A4EF] min-h-[120px]"
                                placeholder="Escribe el contenido de tu plantilla... usa {{nombre_variable}} para variables"
                                required
                            />
                            <p className="text-xs text-[#90A4AE] mt-1">
                                Variables definidas: {detectarVariables(formData.content).join(', ') || 'Ninguna'}
                            </p>

                        </div>

                        <div>
                            <label className="block text-sm font-medium text-[#263238] mb-1">
                                Etiquetas *
                            </label>
                            <TagsInput
                                tags={formData.labels}
                                onChange={(labels) => setFormData({ ...formData, labels })}
                                suggestions={SUGGESTED_TAGS}
                            />
                        </div>

                        <div className="flex gap-3 pt-4">
                            <Button type="button" variant="secondary" onClick={onCancel}>
                                Cancelar
                            </Button>
                            <Button type="submit" className="flex-1">
                                {template ? 'Actualizar' : 'Crear'} Plantilla
                            </Button>
                        </div>
                    </div>
                </Card>

                {/* Preview */}
                <Card className="p-6">
                    <h3 className="text-lg font-semibold text-[#263238] mb-4">Vista Previa</h3>
                    <div className="space-y-4">
                        {Object.keys(previewData).length != 0 && <div className="grid grid-cols-2 gap-3">
                            {Object.entries(previewData).map(([key, value]) => (
                                <div key={key}>
                                    <label className="block text-xs font-medium text-[#546E7A] mb-1">
                                        Variable {key}
                                    </label>
                                    <input
                                        type="text"
                                        value={value}
                                        onChange={(e) => setPreviewData({ ...previewData, [key]: e.target.value })}
                                        className="w-full px-2 py-1 text-sm border border-[#E3F2FD] rounded"
                                    />
                                </div>
                            ))}
                        </div>}
                        <div className="border border-[#E3F2FD] rounded-md p-4 bg-[#F8FAFC] min-h-[200px] flex flex-col justify-between">
                            <div>
                                <div className="flex items-center gap-2 mb-3">
                                    <Badge variant={formData.type === 'urgente' ? 'danger' : 'primary'}>
                                        {formData.type}
                                    </Badge>
                                </div>

                                <div className="text-[#263238] whitespace-pre-wrap leading-relaxed">
                                    {renderPreview() || 'El contenido aparecerá aquí...'}
                                </div>
                            </div>
                            {formData.labels.length > 0 && (
                                <div className="flex flex-wrap justify-end gap-2 mt-4 pt-4">
                                    {formData.labels.map((label, index) => (
                                        <span
                                            key={index}
                                            className="px-2 py-1 bg-white text-[#546E7A] text-xs rounded border"
                                        >
                                            {label}
                                        </span>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </Card>
            </form>
        </div>
    );
};
