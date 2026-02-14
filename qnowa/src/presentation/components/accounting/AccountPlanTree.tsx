'use client';

import { AccountPlanDTO } from '@/infrastructure/actions/accounting.actions';
import { useState } from 'react';

interface AccountPlanTreeProps {
    accounts: AccountPlanDTO[];
}

export function AccountPlanTree({ accounts }: AccountPlanTreeProps) {
    const [expanded, setExpanded] = useState<Record<string, boolean>>({});

    const toggleExpand = (code: string) => {
        setExpanded(prev => ({ ...prev, [code]: !prev[code] }));
    };

    // Organize as tree (naive approach for MVP: nested rendering based on parentCode)
    // Better: Build a tree structure first.

    const rootAccounts = accounts.filter(a => !a.parentCode);

    const renderNode = (account: AccountPlanDTO) => {
        const children = accounts.filter(a => a.parentCode === account.code);
        const hasChildren = children.length > 0;
        const isExpanded = expanded[account.code];

        return (
            <div key={account.id} className="pl-4 border-l border-gray-200">
                <div className="flex items-center py-2 hover:bg-gray-50 rounded px-2">
                    {hasChildren && (
                        <button
                            onClick={() => toggleExpand(account.code)}
                            className="mr-2 text-gray-500 hover:text-gray-700 w-4 h-4 flex items-center justify-center border border-gray-300 rounded text-xs"
                        >
                            {isExpanded ? '-' : '+'}
                        </button>
                    )}
                    {!hasChildren && <div className="w-6 mr-2"></div>}

                    <span className="font-mono text-blue-800 font-semibold mr-2">{account.code}</span>
                    <span className="text-gray-700">{account.name}</span>
                </div>

                {hasChildren && isExpanded && (
                    <div className="ml-2">
                        {children.map(child => renderNode(child))}
                    </div>
                )}
            </div>
        );
    };

    return (
        <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-xl font-bold mb-4 border-b pb-2">Hesap Planı</h2>
            <div className="space-y-1">
                {rootAccounts.map(account => renderNode(account))}
            </div>
        </div>
    );
}
