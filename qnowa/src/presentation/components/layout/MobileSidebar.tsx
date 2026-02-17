'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { Menu, X, Receipt, Calculator, Box, CreditCard, PieChart, Settings, LogOut, FileText, User } from 'lucide-react';

export default function MobileSidebar({ user, children }: { user: any, children: React.ReactNode }) {
    const [isOpen, setIsOpen] = useState(false);
    const pathname = usePathname();

    const toggle = () => setIsOpen(!isOpen);

    const isActive = (path: string) => pathname === path || pathname?.startsWith(path + '/');

    return (
        <div className="flex h-screen bg-gray-50 overflow-hidden">
            {/* Mobile Header */}
            <header className="lg:hidden fixed top-0 w-full z-50 bg-white border-b px-4 py-3 flex items-center justify-between shadow-sm">
                <div className="flex items-center gap-2">
                    <button onClick={toggle} className="p-2 -ml-2 rounded-md hover:bg-gray-100">
                        {isOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                    <span className="font-bold text-lg text-blue-600">Qnowa</span>
                </div>
                <div className="text-sm font-medium text-gray-700">
                    {user?.name?.split(' ')[0] || 'Hesabım'}
                </div>
            </header>

            {/* Sidebar Overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                    onClick={() => setIsOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside className={`
                fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-xl transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:shadow-none border-r flex flex-col
                ${isOpen ? 'translate-x-0' : '-translate-x-full'}
            `}>
                <div className="p-6 hidden lg:block border-b">
                    <h1 className="text-2xl font-bold text-blue-600">Qnowa</h1>
                    <p className="text-xs text-gray-500 mt-1">Ön Muhasebe & E-Fatura</p>
                </div>

                <div className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
                    <NavItem href="/dashboard" icon={<PieChart size={20} />} active={pathname === '/dashboard'} onClick={() => setIsOpen(false)}>
                        Ana Sayfa
                    </NavItem>

                    <div className="pt-4 pb-2 px-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">Fatura</div>
                    <NavItem href="/dashboard/fatura" icon={<FileText size={20} />} active={isActive('/dashboard/fatura')} onClick={() => setIsOpen(false)}>
                        Satış Faturaları
                    </NavItem>
                    <NavItem href="/dashboard/fatura/ocr" icon={<Receipt size={20} />} active={isActive('/dashboard/fatura/ocr')} onClick={() => setIsOpen(false)}>
                        Yapay Zeka Fatura
                    </NavItem>
                    <NavItem href="/dashboard/giderler" icon={<Receipt size={20} />} active={isActive('/dashboard/giderler')} onClick={() => setIsOpen(false)}>
                        Giderler (Alış)
                    </NavItem>

                    <div className="pt-4 pb-2 px-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">Finans</div>
                    <NavItem href="/dashboard/finans/kasa-banka" icon={<CreditCard size={20} />} active={isActive('/dashboard/finans/kasa-banka')} onClick={() => setIsOpen(false)}>
                        Kasa & Banka
                    </NavItem>
                    <NavItem href="/dashboard/finance/cheques" icon={<FileText size={20} />} active={isActive('/dashboard/finance/cheques')} onClick={() => setIsOpen(false)}>
                        Çek & Senetler
                    </NavItem>
                    <NavItem href="/dashboard/finans/hareketler/yeni" icon={<Calculator size={20} />} active={isActive('/dashboard/finans/hareketler/yeni')} onClick={() => setIsOpen(false)}>
                        Tahsilat / Ödeme
                    </NavItem>

                    <div className="pt-4 pb-2 px-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">Stok & Envanter</div>
                    <NavItem href="/dashboard/stok/urunler" icon={<Box size={20} />} active={isActive('/dashboard/stok')} onClick={() => setIsOpen(false)}>
                        Stok & Ürünler
                    </NavItem>

                    <div className="pt-4 pb-2 px-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">Raporlar</div>
                    <NavItem href="/dashboard/raporlar/gelir-gider" icon={<PieChart size={20} />} active={isActive('/dashboard/raporlar')} onClick={() => setIsOpen(false)}>
                        Gelir / Gider (P&L)
                    </NavItem>

                    <div className="pt-4 pb-2 px-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">Ayarlar</div>
                    <NavItem href="/dashboard/settings/roles" icon={<Settings size={20} />} active={isActive('/dashboard/settings')} onClick={() => setIsOpen(false)}>
                        Roller & Yetkiler
                    </NavItem>
                </div>

                <div className="p-4 border-t bg-gray-50">
                    <div className="flex items-center mb-3">
                        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold shrink-0">
                            <User size={20} />
                        </div>
                        <div className="ml-3 overflow-hidden">
                            <p className="text-sm font-medium text-gray-900 truncate">{user?.name}</p>
                            <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                        </div>
                    </div>
                    <button
                        onClick={() => window.location.href = '/api/auth/signout'}
                        className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 bg-red-50 hover:bg-red-100 rounded-md transition-colors"
                    >
                        <LogOut size={16} />
                        Çıkış Yap
                    </button>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 flex flex-col min-w-0 overflow-hidden pt-16 lg:pt-0 h-screen">
                <div className="flex-1 overflow-y-auto p-4 lg:p-8">
                    {children}
                </div>
            </main>
        </div>
    );
}

function NavItem({ href, icon, children, active, onClick }: any) {
    return (
        <Link
            href={href}
            onClick={onClick}
            className={`
                flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors
                ${active
                    ? 'bg-blue-50 text-blue-700'
                    : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'}
            `}
        >
            {icon}
            {children}
        </Link>
    );
}
