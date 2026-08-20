'use client';

import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();

  const continueAsGuest = () => {
    router.push('/tasks');
  };

  return (
    <main
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px',
        background:
          'linear-gradient(135deg, #07071a 0%, #11112b 50%, #07071a 100%)',
        color: 'white',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '420px',
          textAlign: 'center',
        }}
      >
        {/* Logo */}
        <div
          style={{
            width: '64px',
            height: '64px',
            margin: '0 auto 18px',
            display: 'grid',
            placeItems: 'center',
            borderRadius: '18px',
            background:
              'linear-gradient(135deg, #7c3aed, #2563eb)',
            boxShadow:
              '0 0 35px rgba(124,58,237,.45)',
            fontSize: '30px',
            fontWeight: 900,
          }}
        >
          P
        </div>

        {/* App Name */}
        <h1
          style={{
            margin: 0,
            fontSize: '32px',
            fontWeight: 850,
            letterSpacing: '-0.8px',
          }}
        >
          Pyramid
        </h1>

        <p
          style={{
            marginTop: '8px',
            marginBottom: '30px',
            color: '#94a3b8',
            fontSize: '14px',
          }}
        >
          Manage your tasks efficiently
        </p>

        {/* Guest Login */}
        <button
          type="button"
          onClick={continueAsGuest}
          style={{
            width: '100%',
            padding: '14px 18px',
            marginBottom: '12px',
            border: 'none',
            borderRadius: '12px',
            background: '#000000',
            color: 'white',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: 800,
          }}
        >
          Continue as Guest
        </button>

        {/* Google Login */}
        <button
          type="button"
          onClick={() => {
            alert('Google Login will be available soon.');
          }}
          style={{
            width: '100%',
            padding: '14px 18px',
            border: '1px solid rgba(255,255,255,.12)',
            borderRadius: '12px',
            background: 'rgba(255,255,255,.05)',
            color: 'white',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: 700,
          }}
        >
          <span style={{ marginRight: '8px' }}>G</span>
          Login with Google
        </button>

        {/* Terms */}
        <p
          style={{
            marginTop: '24px',
            color: '#64748b',
            fontSize: '11px',
            lineHeight: 1.6,
          }}
        >
          By continuing, you agree to our{' '}
          <span
            style={{
              color: '#a78bfa',
              cursor: 'pointer',
            }}
          >
            Terms of Service
          </span>{' '}
          and{' '}
          <span
            style={{
              color: '#a78bfa',
              cursor: 'pointer',
            }}
          >
            Privacy Policy
          </span>
          .
        </p>
      </div>
    </main>
  );
}