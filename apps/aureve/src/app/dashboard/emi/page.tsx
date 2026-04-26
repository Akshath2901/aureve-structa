'use client'

import { useState } from 'react'

export default function EMIPage() {
  const [loan,   setLoan]   = useState(5000000)
  const [rate,   setRate]   = useState(8.5)
  const [tenure, setTenure] = useState(20)

  const monthlyRate = rate / 12 / 100
  const n = tenure * 12
  const emi = loan * monthlyRate * Math.pow(1 + monthlyRate, n) / (Math.pow(1 + monthlyRate, n) - 1)
  const totalPayment = emi * n
  const totalInterest = totalPayment - loan

  const fmt = (n: number) => {
    if (n >= 10000000) return `₹${(n/10000000).toFixed(2)} Cr`
    if (n >= 100000) return `₹${(n/100000).toFixed(2)} Lac`
    return `₹${Math.round(n).toLocaleString('en-IN')}`
  }

  return (
    <div>
      <div style={{ marginBottom: '2.5rem' }}>
        <p style={{ fontSize: '12px', color: 'var(--text-muted)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '6px', fontFamily: 'DM Sans, sans-serif' }}>Financial planning</p>
        <h1 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '2.5rem', fontWeight: 400, color: 'var(--charcoal)', marginBottom: '4px' }}>EMI Calculator</h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ width: '20px', height: '1px', background: 'var(--gold)' }} />
          <p style={{ fontSize: '13px', color: 'var(--text-muted)', fontFamily: 'DM Sans, sans-serif' }}>Plan your home loan repayment</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
        {/* Controls */}
        <div style={{ background: '#fff', borderRadius: '16px', padding: '1.75rem', border: '1px solid rgba(26,26,22,0.08)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1.75rem' }}>
            <div style={{ width: '20px', height: '1px', background: 'var(--gold)' }} />
            <h3 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.3rem', color: 'var(--charcoal)' }}>Loan details</h3>
          </div>

          {[
            { label: 'Loan amount', value: loan, setter: setLoan, min: 500000, max: 50000000, step: 100000, display: fmt(loan) },
            { label: 'Interest rate (%)', value: rate, setter: setRate, min: 5, max: 20, step: 0.1, display: `${rate}%` },
            { label: 'Tenure (years)', value: tenure, setter: setTenure, min: 1, max: 30, step: 1, display: `${tenure} yrs` },
          ].map((s) => (
            <div key={s.label} style={{ marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', fontFamily: 'DM Sans, sans-serif' }}>{s.label}</label>
                <span style={{ fontSize: '14px', fontWeight: 700, color: 'var(--gold)', fontFamily: 'Cormorant Garamond, serif' }}>{s.display}</span>
              </div>
              <input type="range" min={s.min} max={s.max} step={s.step} value={s.value}
                onChange={e => s.setter(Number(e.target.value))}
                style={{ width: '100%', accentColor: 'var(--gold)', cursor: 'pointer' }} />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', color: 'var(--text-muted)', marginTop: '3px', fontFamily: 'DM Sans, sans-serif' }}>
                <span>{s.min.toLocaleString('en-IN')}</span>
                <span>{s.max.toLocaleString('en-IN')}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Results */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {/* Monthly EMI */}
          <div style={{
            background: 'linear-gradient(135deg, #1A1A16 0%, #2C2C28 100%)',
            borderRadius: '16px', padding: '2rem', textAlign: 'center',
            border: '1px solid rgba(201,168,76,0.15)',
          }}>
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '1px', background: 'linear-gradient(to right, transparent, var(--gold), transparent)', borderRadius: '16px' }} />
            <p style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(250,248,243,0.4)', marginBottom: '8px', fontFamily: 'DM Sans, sans-serif' }}>Monthly EMI</p>
            <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '3rem', fontWeight: 400, color: 'var(--gold-light)', lineHeight: 1, marginBottom: '6px' }}>
              {fmt(emi)}
            </div>
            <p style={{ fontSize: '12px', color: 'rgba(250,248,243,0.4)', fontFamily: 'DM Sans, sans-serif' }}>per month for {tenure} years</p>
          </div>

          {/* Breakdown */}
          <div style={{ background: '#fff', borderRadius: '16px', padding: '1.5rem', border: '1px solid rgba(26,26,22,0.08)' }}>
            {[
              { label: 'Principal amount',  value: fmt(loan),          color: '#534AB7' },
              { label: 'Total interest',    value: fmt(totalInterest), color: '#E07B39' },
              { label: 'Total payment',     value: fmt(totalPayment),  color: '#1D9E75' },
            ].map((r, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: i < 2 ? '1px solid rgba(26,26,22,0.06)' : 'none' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{ width: '10px', height: '10px', borderRadius: '2px', background: r.color, flexShrink: 0 }} />
                  <span style={{ fontSize: '13px', color: 'var(--text-secondary)', fontFamily: 'DM Sans, sans-serif' }}>{r.label}</span>
                </div>
                <span style={{ fontSize: '14px', fontWeight: 600, color: r.color, fontFamily: 'Cormorant Garamond, serif' }}>{r.value}</span>
              </div>
            ))}
          </div>

          {/* Interest ratio */}
          <div style={{ background: '#fff', borderRadius: '16px', padding: '1.25rem', border: '1px solid rgba(26,26,22,0.08)' }}>
            <p style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '8px', fontFamily: 'DM Sans, sans-serif' }}>Principal vs Interest</p>
            <div style={{ display: 'flex', height: '8px', borderRadius: '4px', overflow: 'hidden', gap: '2px' }}>
              <div style={{ background: '#534AB7', flex: loan }} />
              <div style={{ background: '#E07B39', flex: totalInterest }} />
            </div>
            <div style={{ display: 'flex', gap: '16px', marginTop: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <div style={{ width: '8px', height: '8px', borderRadius: '2px', background: '#534AB7' }} />
                <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontFamily: 'DM Sans, sans-serif' }}>Principal {Math.round(loan/totalPayment*100)}%</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <div style={{ width: '8px', height: '8px', borderRadius: '2px', background: '#E07B39' }} />
                <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontFamily: 'DM Sans, sans-serif' }}>Interest {Math.round(totalInterest/totalPayment*100)}%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
