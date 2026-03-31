'use client'

import React, { useState, useEffect } from 'react'
import { GitBranch, MonitorPlay, Eye, EyeOff, Info, Layers, User, AlertCircle, RefreshCw } from 'lucide-react'
import { InputField } from './ui/InputField'
import { useDashboard } from '@/context/DashboardContext'

export function GitIntegrationManager() {
  const { isDiffOpen } = useDashboard()
  const [repoUrl, setRepoUrl] = useState('')
  const [branch, setBranch] = useState('main')
  const [pat, setPat] = useState('')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [syncing, setSyncing] = useState(false)
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [showToken, setShowToken] = useState(false)

  const hasUnsavedChanges = true // Keep simple for now or track initial state

  useEffect(() => {
    fetchConfig()
  }, [])

  const fetchConfig = async () => {
    try {
      setLoading(true)
      const res = await fetch('/api/git/config')
      const data = await res.json()
      setRepoUrl(data.repositoryUrl || '')
      setBranch(data.branch || 'main')
      setPat(data.githubToken || '')
      setName(data.committerName || '')
      setEmail(data.committerEmail || '')
    } catch (err) {
      console.error('Failed to fetch git config', err)
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    try {
      setSaving(true)
      setStatus('idle')
      const res = await fetch('/api/git/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          repositoryUrl: repoUrl,
          branch,
          githubToken: pat,
          committerName: name,
          committerEmail: email
        })
      })
      if (res.ok) setStatus('success')
      else setStatus('error')
    } catch (error) {
      setStatus('error')
    } finally {
      setSaving(false)
    }
  }

  const handleSync = async () => {
    try {
      setSyncing(true)
      const res = await fetch('/api/git/sync', { method: 'POST' })
      if (res.ok) {
        const data = await res.json()
        alert(`Sync Successful: ${data.result}`)
      } else {
        alert('Sync Failed')
      }
    } catch (err) {
      alert('Sync error')
    } finally {
      setSyncing(false)
    }
  }

  const handleDisconnect = async () => {
    if (!confirm('Are you sure you want to disconnect? This clears local configuration.')) return
    try {
      await fetch('/api/git/config', { method: 'DELETE' })
      setRepoUrl('')
      setBranch('main')
      setPat('')
      setName('')
      setEmail('')
      setStatus('idle')
    } catch (err) {
      alert('Disconnect error')
    }
  }

  // Section Header Component
  const SectionHeader = ({ icon: Icon, title }: { icon: any; title: string }) => (
    <div className="flex items-center gap-3">
      <Icon className="w-4 h-4 text-gray-400" />
      <span className="text-[14px] font-sans font-semibold text-gray-900 uppercase tracking-widest">
        {title}
      </span>
    </div>
  )

  if (loading) return (
    <div className="flex items-center justify-center h-64 border border-dashed border-[#e5e5e5] mt-6">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
    </div>
  )

  return (
    <div className="space-y-10 pb-32 w-full">
      
      {/* 1. SYNC STATUS */}
      <div className="bg-[#fafafa] border border-gray-200 p-8 lg:p-10 space-y-8 mt-6">
        <SectionHeader icon={GitBranch} title="SYNC STATUS" />
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className="p-3 bg-white border border-gray-200 rounded-[2px]">
              <GitBranch className="w-6 h-6 text-[#111]" />
            </div>
            <div className="space-y-1.5">
                <div className="flex items-center gap-3">
                  <span className={`text-[9px] font-mono font-bold ${repoUrl ? 'bg-[#777E65]' : 'bg-gray-400'} text-white px-2 py-0.5 uppercase tracking-wider rounded-[2px]`}>
                    {repoUrl ? 'CONNECTED' : 'DISCONNECTED'}
                  </span>
                </div>
                <div className="flex items-center gap-2 font-mono text-[13px] text-gray-900 tracking-tight">
                  <span className="text-gray-400">repo:</span>
                  <span>{repoUrl || 'No repository configured'}</span>
                </div>
            </div>
          </div>

          <div className="flex flex-col items-end gap-2 shrink-0">
              <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-gray-400">TARGET BRANCH</span>
              <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-[2px] border border-gray-200">
                  <MonitorPlay className="w-3.5 h-3.5 text-gray-400" />
                  <span className="font-mono text-[12px] font-medium text-gray-900">{branch || 'main'}</span>
              </div>
          </div>
        </div>
      </div>

      {/* 2. REPOSITORY CONFIGURATION */}
      <div className="bg-[#fafafa] border border-gray-200 p-8 lg:p-10 space-y-8">
        <SectionHeader icon={Layers} title="REPOSITORY CONFIGURATION" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <InputField 
            label="REPOSITORY URL"
            value={repoUrl}
            onChange={setRepoUrl}
            placeholder="https://github.com/0xfzz/portfolio"
          />
          <InputField 
            label="TARGET BRANCH"
            value={branch}
            onChange={setBranch}
            placeholder="main"
          />
        </div>
      </div>

      {/* 3. AUTHENTICATION */}
      <div className="bg-[#fafafa] border border-gray-200 p-8 lg:p-10 space-y-8">
        <SectionHeader icon={Eye} title="AUTHENTICATION" />
        <div className="space-y-6">
          <div className="relative">
            <InputField 
              label="GITHUB PERSONAL ACCESS TOKEN"
              value={pat}
              onChange={setPat}
              type={showToken ? 'text' : 'password'}
              className="pr-12 tracking-widest text-[14px]"
              placeholder="ghp_************************************"
            />
            <button 
              type="button"
              onClick={() => setShowToken(!showToken)}
              className="absolute right-4 top-[38px] text-gray-400 hover:text-gray-600 transition-colors"
            >
              {showToken ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          <div className="flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-wider text-gray-400 pl-1">
            <Info className="w-3 h-3" />
            <span>Requires repo scope for read/write operations.</span>
          </div>
        </div>
      </div>

      {/* 4. IDENTITY */}
      <div className="bg-[#fafafa] border border-gray-200 p-8 lg:p-10 space-y-8">
        <SectionHeader icon={User} title="IDENTITY" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <InputField 
            label="COMMITTER NAME"
            value={name}
            onChange={setName}
            placeholder="Faiz Nurdiana"
          />
          <InputField 
            label="COMMITTER EMAIL"
            value={email}
            onChange={setEmail}
            placeholder="faiz@0xfzz.my.id"
          />
        </div>
      </div>

      {/* 5. DANGER ZONE */}
      <div className="bg-[#fafafa] border border-[#cf222e] p-8 lg:p-10 space-y-8">
        <div className="flex items-center gap-3 text-[#cf222e]">
          <AlertCircle className="w-4 h-4" />
          <span className="text-[14px] font-sans font-semibold uppercase tracking-widest">DANGER ZONE</span>
        </div>
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1.5">
            <span className="text-[12px] font-sans font-bold text-gray-900 uppercase tracking-wide block">DESTRUCTIVE ACTIONS</span>
            <p className="text-[12px] text-gray-500 font-sans max-w-[280px] leading-relaxed pr-6">
              Changes here may result in permanent data loss if sync state is inconsistent.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row items-center gap-4 shrink-0">
            <button 
              onClick={handleSync}
              disabled={syncing}
              className="w-full sm:w-auto px-6 py-3 border border-[#cf222e] text-[#cf222e] text-[10px] font-bold uppercase tracking-[0.15em] hover:bg-red-50 transition-colors rounded-none bg-white text-center disabled:opacity-50"
            >
              {syncing ? 'SYNCING...' : 'FORCE PULL (OVERWRITE\nLOCAL)'}
            </button>
            <button 
              onClick={handleDisconnect}
              className="w-full sm:w-auto px-6 py-3 bg-[#cf222e] text-white text-[10px] font-bold uppercase tracking-[0.1em] hover:bg-[#a52a2a] transition-colors rounded-none text-center"
            >
              DISCONNECT<br/>REPOSITORY
            </button>
          </div>
        </div>
      </div>

      {/* FLOATING ACTION BAR */}
      <div className={`fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 py-6 px-10 lg:px-12 z-30 flex justify-center transition-all duration-300 ${isDiffOpen ? 'blur-sm grayscale-[0.5] opacity-80 pointer-events-none' : ''}`}>
        <div className="w-full flex items-center justify-between pl-[240px]">
            
            <div className="flex items-center gap-3">
            {status === 'success' && (
              <div className="flex items-center gap-2 text-olive-500">
                <div className="w-2 h-2 rounded-full bg-olive-500" />
                <span className="text-[11px] font-mono font-bold uppercase tracking-widest text-gray-500">
                  CONFIGURATION COMMITTED
                </span>
              </div>
            )}
            {status === 'error' && (
              <div className="flex items-center gap-2 text-red-500">
                <div className="w-2 h-2 rounded-full bg-red-500" />
                <span className="text-[11px] font-mono font-bold uppercase tracking-widest">
                  PERSISTENCE FAILED
                </span>
              </div>
            )}
            {status === 'idle' && (
              <div className="flex items-center gap-2 text-gray-400">
                <div className="w-2 h-2 rounded-full bg-gray-300" />
                <span className="text-[11px] font-mono font-bold uppercase tracking-widest">
                  {loading ? 'INITIALIZING...' : 'LOCAL_CONFIG_ACTIVE'}
                </span>
              </div>
            )}
            </div>

            <div className="flex items-center gap-4">
            <button 
              onClick={fetchConfig}
              className="w-[92px] h-[42px] bg-gray-50 border border-gray-800 text-gray-800 text-[12px] font-mono font-bold tracking-widest hover:bg-gray-100 transition-colors rounded-none"
            >
                RESET
            </button>
            <button 
              onClick={handleSave}
              disabled={saving}
              className="w-[207px] h-[42px] bg-gray-800 text-white text-[12px] font-mono font-bold tracking-widest hover:bg-black transition-colors rounded-none shadow-none flex items-center justify-center gap-3 disabled:opacity-50"
            >
                {saving && <RefreshCw className="w-3.5 h-3.5 animate-spin" />}
                {saving ? 'SAVING...' : 'SAVE LOCALLY'}
            </button>
            </div>

        </div>
      </div>
    </div>
  )
}
