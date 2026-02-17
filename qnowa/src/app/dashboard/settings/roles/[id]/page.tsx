
import { getRoleWithPermissions, getAllPermissions, updateRolePermissions } from '@/infrastructure/actions/role.actions';
import { redirect } from 'next/navigation';

export default async function RoleEditorPage({ params }: { params: { id: string } }) {
    const role = await getRoleWithPermissions(params.id);
    const allPermissions = await getAllPermissions();

    if (!role) {
        redirect('/dashboard/settings/roles');
    }

    // Group permissions
    const groups: Record<string, typeof allPermissions> = {};
    allPermissions.forEach(p => {
        if (!groups[p.group]) groups[p.group] = [];
        groups[p.group].push(p);
    });

    const rolePermissionIds = new Set(role.permissions.map(rp => rp.permissionId));

    async function savePermissions(formData: FormData) {
        'use server';
        const selectedPermissions = Array.from(formData.keys()).filter(k => k.startsWith('perm_')).map(k => k.replace('perm_', ''));
        await updateRolePermissions(role!.id, selectedPermissions);
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-900">Rol Düzenle: {role.name}</h1>
                <a href="/dashboard/settings/roles" className="text-gray-600 hover:text-gray-900">
                    &larr; Geri Dön
                </a>
            </div>

            <form action={savePermissions} className="bg-white shadow rounded-lg p-6 space-y-8">
                {Object.entries(groups).map(([group, perms]) => (
                    <div key={group}>
                        <h3 className="text-lg font-medium text-gray-900 border-b pb-2 mb-4">{group}</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {perms.map(perm => (
                                <label key={perm.id} className="flex items-start space-x-3">
                                    <input
                                        type="checkbox"
                                        name={`perm_${perm.id}`}
                                        defaultChecked={rolePermissionIds.has(perm.id)}
                                        className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 mt-1"
                                    />
                                    <div>
                                        <span className="text-sm font-medium text-gray-700 block">{perm.key}</span>
                                        <span className="text-xs text-gray-500 block">{perm.description}</span>
                                    </div>
                                </label>
                            ))}
                        </div>
                    </div>
                ))}

                <div className="pt-4 border-t flex justify-end">
                    <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700">
                        Kaydet
                    </button>
                </div>
            </form>
        </div>
    );
}
