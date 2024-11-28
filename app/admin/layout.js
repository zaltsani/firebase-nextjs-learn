'use client'

import Header from '@/components/Header'
import ProtectedRoute from '@/components/ProtectedRoute';

function Layout({ children }) {
    return (
        <div className='flex flex-col h-screen w-screen'>
            <Header />
            <main className='flex-grow w-screen'>
                {children}
            </main>
        </div>
    );
}

export default ProtectedRoute(Layout, ['superadmin', 'admin'])