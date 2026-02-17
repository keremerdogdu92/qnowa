
import { getRoles, createRole, deleteRole } from '@/infrastructure/actions/role.actions';
import Link from 'next/link';

export default async function RolesPage() {
    const roles = await getRoles();

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-900">Rol Yönetimi</h1>
                {/* Simple Form inline or dedicated page? Inline for simplicity */}
                <form action={createRole} className="flex gap-2">
                    <input
                        type="text"
                        name="name"
                        placeholder="Yeni Rol Adı"
                        className="border rounded px-3 py-2 text-sm"
                        required
                    />
                    <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded text-sm hover:bg-blue-700">
                        Ekle
                    </button>
                </form>
            </div>

            <div className="bg-white shadow overflow-hidden sm:rounded-md">
                <ul className="divide-y divide-gray-200">
                    {roles.map((role) => (
                        <li key={role.id} className="px-6 py-4 flex items-center justify-between hover:bg-gray-50">
                            <div>
                                <h3 className="text-lg font-medium text-gray-900">{role.name}</h3>
                                {role.isSystem && (
                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                        Sistem Rolü
                                    </span>
                                )}
                            </div>
                            <div className="flex items-center space-x-4">
                                <Link
                                    href={`/dashboard/settings/roles/${role.id}`}
                                    className="text-indigo-600 hover:text-indigo-900 font-medium"
                                >
                                    Yetkiler
                                </Link>
                                {!role.isSystem && (
                                    <form action={deleteRole.bind(null, role.id)}>
                                        <button type="submit" className="text-red-600 hover:text-red-900 text-sm">
                                            Sil
                                        </button>
                                    </form>
                                )}
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}
