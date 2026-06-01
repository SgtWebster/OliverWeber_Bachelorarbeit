'use client';

import { useState } from 'react';

export default function ContactTrigger() {
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

    const handleSendEmail = async () => {
        setStatus('loading');
        
        try {
            // Hier lösen wir den Request an deine API-Route aus
            const response = await fetch('/api/contact', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                // Das ist die "message", die deine route.ts aus dem request.json() ausliest
                body: JSON.stringify({ 
                    message: 'Hallo! Dieser Trigger wurde gerade von der Website ausgelöst.' 
                }),
            });

            if (response.ok) {
                setStatus('success');
            } else {
                setStatus('error');
            }
        } catch (error) {
            console.error('Fehler beim Aufruf der E-Mail API:', error);
            setStatus('error');
        }
    };

    return (
        <div className="p-4">
            <button 
                onClick={handleSendEmail} 
                disabled={status === 'loading'}
                className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
            >
                {status === 'loading' ? 'Wird gesendet...' : 'E-Mail Trigger auslösen'}
            </button>
            
            {status === 'success' && <p className="text-green-600 mt-2">E-Mail wurde erfolgreich versendet!</p>}
            {status === 'error' && <p className="text-red-600 mt-2">Es gab ein Problem beim Senden.</p>}
        </div>
    );
}