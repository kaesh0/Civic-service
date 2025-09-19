import React from "react";
import { useNavigate } from "react-router-dom";

export default function Welcome() {
  const navigate = useNavigate();

  return (
    <div style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
      padding: '20px'
    }}>
      <div style={{ 
        maxWidth: '400px', 
        width: '100%', 
        textAlign: 'center' 
      }}>
        {/* App Logo and Name */}
        <div style={{ marginBottom: '48px' }}>
          <div style={{
            width: '80px',
            height: '80px',
            background: '#0a5eb7',
            borderRadius: '20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 24px',
            boxShadow: '0 8px 24px rgba(10, 94, 183, 0.3)'
          }}>
            <div style={{ fontSize: '40px', color: 'white' }}>🏛️</div>
          </div>
          <h1 style={{ 
            fontSize: '32px', 
            fontWeight: '700', 
            color: '#0f172a', 
            margin: '0 0 12px 0' 
          }}>Civic Service</h1>
          <p style={{ 
            fontSize: '16px', 
            color: '#6b7280', 
            margin: '0 0 24px 0' 
          }}>Empowering citizens to build better communities</p>
          
          {/* Inspirational Quote */}
          <div style={{
            background: 'rgba(255, 255, 255, 0.8)',
            borderRadius: '16px',
            padding: '20px',
            marginTop: '16px',
            border: '1px solid rgba(10, 94, 183, 0.1)'
          }}>
            <div style={{ fontSize: '24px', color: '#0a5eb7', marginBottom: '8px' }}>💬</div>
            <p style={{ 
              fontSize: '16px', 
              fontStyle: 'italic', 
              color: '#0f172a', 
              margin: '0', 
              lineHeight: '1.5' 
            }}>"Building a better tomorrow, one report at a time"</p>
          </div>
        </div>

        {/* Login Options */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '32px' }}>
          <button 
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '16px',
              padding: '20px',
              background: '#fff',
              border: '2px solid #dbe3f3',
              borderRadius: '16px',
              cursor: 'pointer',
              textAlign: 'left',
              width: '100%'
            }}
            onClick={() => navigate("/login?type=citizen")}
          >
            <div style={{
              width: '48px',
              height: '48px',
              background: '#eaf2ff',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}>
              👤
            </div>
            <div style={{ flex: 1 }}>
              <h3 style={{ 
                fontSize: '18px', 
                fontWeight: '600', 
                color: '#0f172a', 
                margin: '0 0 4px 0' 
              }}>Login as Citizen</h3>
              <p style={{ 
                fontSize: '14px', 
                color: '#6b7280', 
                margin: '0' 
              }}>Report issues and track community progress</p>
            </div>
            <div style={{ fontSize: '20px', color: '#6b7280' }}>→</div>
          </button>

          <button 
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '16px',
              padding: '20px',
              background: '#fff',
              border: '2px solid #059669',
              borderRadius: '16px',
              cursor: 'pointer',
              textAlign: 'left',
              width: '100%'
            }}
            onClick={() => navigate("/login?type=government")}
          >
            <div style={{
              width: '48px',
              height: '48px',
              background: '#d1fae5',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}>
              🏛️
            </div>
            <div style={{ flex: 1 }}>
              <h3 style={{ 
                fontSize: '18px', 
                fontWeight: '600', 
                color: '#0f172a', 
                margin: '0 0 4px 0' 
              }}>Login as Government Official</h3>
              <p style={{ 
                fontSize: '14px', 
                color: '#6b7280', 
                margin: '0' 
              }}>Access administrative dashboard and manage reports</p>
            </div>
            <div style={{ fontSize: '20px', color: '#6b7280' }}>→</div>
          </button>
        </div>

        {/* Guest option removed */}
      </div>
    </div>
  );
}
