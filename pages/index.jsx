import React, { useState, useEffect } from 'react';
import { Sparkles, Play, Zap, History, Download, Trash2, Copy } from 'lucide-react';

export default function VideoAgentApp() {
  const [prompt, setPrompt] = useState('');
  const [videoStyle, setVideoStyle] = useState('cinematic');
  const [duration, setDuration] = useState('10');
  const [generations, setGenerations] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeTab, setActiveTab] = useState('generate');
  const [progress, setProgress] = useState(0);

  // Simulate video generation (no API needed!)
  const generateVideo = async () => {
    if (!prompt.trim()) {
      alert('Please enter a prompt');
      return;
    }

    setIsGenerating(true);
    setProgress(0);
    const generationId = Date.now();
    
    const newGeneration = {
      id: generationId,
      prompt: prompt,
      style: videoStyle,
      duration: duration,
      status: 'processing',
      progress: 0,
      createdAt: new Date().toLocaleString(),
      videoPreview: null,
      error: null
    };

    setGenerations(prev => [newGeneration, ...prev]);

    try {
      // Simulate generation with progress
      for (let i = 0; i <= 100; i += 5) {
        await new Promise(resolve => setTimeout(resolve, 200));
        setProgress(i);
        setGenerations(prev =>
          prev.map(gen =>
            gen.id === generationId ? { ...gen, progress: i } : gen
          )
        );
      }

      // Create a preview image/placeholder
      const canvas = document.createElement('canvas');
      canvas.width = 1280;
      canvas.height = 720;
      const ctx = canvas.getContext('2d');

      // Generate gradient background
      const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
      gradient.addColorStop(0, '#667eea');
      gradient.addColorStop(1, '#764ba2');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Add text
      ctx.fillStyle = 'white';
      ctx.font = 'bold 48px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('VideoAI Generated', canvas.width / 2, canvas.height / 2 - 60);
      
      ctx.font = '32px Arial';
      ctx.fillText(`Style: ${videoStyle} | Duration: ${duration}s`, canvas.width / 2, canvas.height / 2 + 20);
      
      ctx.font = '24px Arial';
      ctx.fillStyle = 'rgba(255,255,255,0.8)';
      ctx.fillText(prompt.substring(0, 80), canvas.width / 2, canvas.height / 2 + 70);

      // Add play button in center
      ctx.fillStyle = 'rgba(255,255,255,0.3)';
      ctx.beginPath();
      ctx.arc(canvas.width / 2, canvas.height / 2 - 150, 60, 0, Math.PI * 2);
      ctx.fill();
      
      ctx.fillStyle = 'white';
      ctx.beginPath();
      ctx.moveTo(canvas.width / 2 - 25, canvas.height / 2 - 190);
      ctx.lineTo(canvas.width / 2 - 25, canvas.height / 2 - 110);
      ctx.lineTo(canvas.width / 2 + 35, canvas.height / 2 - 150);
      ctx.closePath();
      ctx.fill();

      const previewUrl = canvas.toDataURL('image/png');

      setGenerations(prev =>
        prev.map(gen =>
          gen.id === generationId
            ? {
                ...gen,
                status: 'completed',
                progress: 100,
                videoPreview: previewUrl,
                downloadUrl: `video_${generationId}.mp4`
              }
            : gen
        )
      );
    } catch (error) {
      setGenerations(prev =>
        prev.map(gen =>
          gen.id === generationId
            ? { ...gen, status: 'failed', error: error.message }
            : gen
        )
      );
    } finally {
      setIsGenerating(false);
      setProgress(0);
    }
  };

  const deleteGeneration = (id) => {
    setGenerations(prev => prev.filter(gen => gen.id !== id));
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    alert('Copied to clipboard!');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Animated background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" style={{animationDelay: '2s'}}></div>
        <div className="absolute bottom-0 left-1/2 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" style={{animationDelay: '4s'}}></div>
      </div>

      <style>{`
        .glass-effect {
          background: rgba(15, 23, 42, 0.8);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(148, 113, 233, 0.2);
        }
      `}</style>

      <div className="relative z-10 max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Sparkles className="w-8 h-8 text-purple-400" />
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-300 via-pink-300 to-blue-300 bg-clip-text text-transparent">
              VideoAI Agent
            </h1>
            <Zap className="w-8 h-8 text-yellow-400" />
          </div>
          <p className="text-purple-200 text-lg">Generate amazing video previews instantly • NO APIs, NO SETUP</p>
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Panel - Generator */}
          <div className="lg:col-span-1 space-y-4">
            <div className="glass-effect rounded-2xl p-6 space-y-4">
              {/* Tabs */}
              <div className="flex gap-2">
                <button
                  onClick={() => setActiveTab('generate')}
                  className={`flex-1 py-2 px-4 rounded-lg font-semibold transition-all ${
                    activeTab === 'generate'
                      ? 'bg-purple-600 text-white'
                      : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                  }`}
                >
                  <Play className="w-4 h-4 inline mr-2" />
                  Create
                </button>
                <button
                  onClick={() => setActiveTab('history')}
                  className={`flex-1 py-2 px-4 rounded-lg font-semibold transition-all ${
                    activeTab === 'history'
                      ? 'bg-purple-600 text-white'
                      : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                  }`}
                >
                  <History className="w-4 h-4 inline mr-2" />
                  History
                </button>
              </div>

              {activeTab === 'generate' && (
                <div className="space-y-4">
                  {/* Prompt Input */}
                  <div>
                    <label className="block text-sm font-semibold text-purple-200 mb-2">
                      Video Description
                    </label>
                    <textarea
                      value={prompt}
                      onChange={(e) => setPrompt(e.target.value)}
                      placeholder="Describe your video... (e.g., 'A futuristic city with flying cars at sunset')"
                      className="w-full bg-slate-800 border border-purple-500/30 rounded-lg p-3 text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 resize-none"
                      rows="4"
                    />
                  </div>

                  {/* Style Selection */}
                  <div>
                    <label className="block text-sm font-semibold text-purple-200 mb-2">
                      Video Style
                    </label>
                    <select
                      value={videoStyle}
                      onChange={(e) => setVideoStyle(e.target.value)}
                      className="w-full bg-slate-800 border border-purple-500/30 rounded-lg p-3 text-white focus:outline-none focus:border-purple-500"
                    >
                      <option value="cinematic">Cinematic</option>
                      <option value="animated">Animated</option>
                      <option value="realistic">Realistic</option>
                      <option value="stylized">Stylized</option>
                      <option value="documentary">Documentary</option>
                      <option value="abstract">Abstract</option>
                    </select>
                  </div>

                  {/* Duration */}
                  <div>
                    <label className="block text-sm font-semibold text-purple-200 mb-2">
                      Duration: {duration}s
                    </label>
                    <input
                      type="range"
                      min="5"
                      max="60"
                      value={duration}
                      onChange={(e) => setDuration(e.target.value)}
                      className="w-full accent-purple-600"
                    />
                    <div className="flex justify-between text-xs text-slate-400 mt-1">
                      <span>5s</span>
                      <span>60s</span>
                    </div>
                  </div>

                  {/* Generate Button */}
                  <button
                    onClick={generateVideo}
                    disabled={isGenerating || !prompt.trim()}
                    className={`w-full font-semibold py-3 px-4 rounded-lg transition-all flex items-center justify-center gap-2 ${
                      isGenerating || !prompt.trim()
                        ? 'bg-slate-700 text-slate-400 cursor-not-allowed'
                        : 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white'
                    }`}
                  >
                    {isGenerating ? (
                      <>
                        <div className="w-5 h-5 border-2 border-purple-400 border-t-pink-400 rounded-full animate-spin" />
                        Generating... {progress}%
                      </>
                    ) : (
                      <>
                        <Zap className="w-5 h-5" />
                        Generate Preview
                      </>
                    )}
                  </button>

                  {/* Info Box */}
                  <div className="bg-blue-500/20 border border-blue-500/50 rounded-lg p-3">
                    <p className="text-sm text-blue-200">
                      ✨ <strong>No API Keys Needed!</strong> Generate video previews instantly with zero setup!
                    </p>
                  </div>
                </div>
              )}

              {activeTab === 'history' && (
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {generations.length === 0 ? (
                    <p className="text-center text-slate-400 py-6">No videos created yet</p>
                  ) : (
                    generations.map((gen) => (
                      <div key={gen.id} className="bg-slate-800 rounded-lg p-3 text-sm">
                        <p className="text-slate-300 font-semibold truncate">{gen.prompt}</p>
                        <p className="text-xs text-slate-500 mt-1">{gen.createdAt}</p>
                        <div className="flex gap-2 mt-2">
                          <span className={`text-xs px-2 py-1 rounded ${
                            gen.status === 'completed' ? 'bg-green-500/20 text-green-400' :
                            gen.status === 'failed' ? 'bg-red-500/20 text-red-400' :
                            'bg-yellow-500/20 text-yellow-400'
                          }`}>
                            {gen.status}
                          </span>
                          <span className="text-xs px-2 py-1 rounded bg-slate-700 text-slate-300">
                            {gen.duration}s
                          </span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Right Panel - Generations Display */}
          <div className="lg:col-span-2">
            <div className="glass-effect rounded-2xl p-6">
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                <Play className="w-6 h-6 text-purple-400" />
                Your Videos
              </h2>

              {generations.length === 0 ? (
                <div className="text-center py-16">
                  <Sparkles className="w-16 h-16 text-purple-400/30 mx-auto mb-4" />
                  <p className="text-slate-400 text-lg">No videos yet</p>
                  <p className="text-slate-500 text-sm mt-2">Create your first video preview to get started!</p>
                </div>
              ) : (
                <div className="grid md:grid-cols-2 gap-6">
                  {generations.map((gen) => (
                    <div key={gen.id} className="bg-slate-800 rounded-xl overflow-hidden border border-slate-700 hover:border-purple-500/50 transition-all">
                      {/* Video Preview */}
                      <div className="relative bg-slate-900 aspect-video flex items-center justify-center overflow-hidden group">
                        {gen.status === 'processing' && (
                          <>
                            <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-pink-600/20"></div>
                            <div className="text-center z-10">
                              <div className="w-12 h-12 border-3 border-purple-400 border-t-pink-400 rounded-full animate-spin mx-auto mb-3"></div>
                              <p className="text-white font-semibold">{gen.progress}%</p>
                            </div>
                          </>
                        )}
                        {gen.status === 'completed' && gen.videoPreview && (
                          <>
                            <img
                              src={gen.videoPreview}
                              alt="Video preview"
                              className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all flex items-center justify-center">
                              <Play className="w-16 h-16 text-white opacity-0 group-hover:opacity-100 transition-all" />
                            </div>
                          </>
                        )}
                        {gen.status === 'failed' && (
                          <div className="text-center text-red-400">
                            <p className="font-semibold text-lg">Generation Failed</p>
                            <p className="text-sm mt-2">{gen.error}</p>
                          </div>
                        )}
                      </div>

                      {/* Info */}
                      <div className="p-4 space-y-3">
                        <div>
                          <p className="text-sm text-slate-400">Description:</p>
                          <p className="text-white text-sm font-semibold line-clamp-2">{gen.prompt}</p>
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-xs">
                          <div className="bg-slate-700/50 rounded p-2">
                            <p className="text-slate-400">Style</p>
                            <p className="text-purple-300 font-semibold capitalize">{gen.style}</p>
                          </div>
                          <div className="bg-slate-700/50 rounded p-2">
                            <p className="text-slate-400">Length</p>
                            <p className="text-purple-300 font-semibold">{gen.duration}s</p>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-2">
                          {gen.status === 'completed' && (
                            <>
                              <button
                                onClick={() => copyToClipboard(gen.prompt)}
                                className="flex-1 bg-slate-700 hover:bg-slate-600 text-white py-2 px-3 rounded text-xs font-semibold flex items-center justify-center gap-1 transition-all"
                              >
                                <Copy className="w-3 h-3" />
                                Copy
                              </button>
                              <button
                                onClick={() => {
                                  const link = document.createElement('a');
                                  link.href = gen.videoPreview;
                                  link.download = `video_${gen.id}.png`;
                                  link.click();
                                }}
                                className="flex-1 bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 py-2 px-3 rounded text-xs font-semibold flex items-center justify-center gap-1 transition-all"
                              >
                                <Download className="w-3 h-3" />
                                Save
                              </button>
                              <button
                                onClick={() => deleteGeneration(gen.id)}
                                className="flex-1 bg-red-600/20 hover:bg-red-600/30 text-red-400 py-2 px-3 rounded text-xs font-semibold flex items-center justify-center gap-1 transition-all"
                              >
                                <Trash2 className="w-3 h-3" />
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Info Footer */}
        <div className="mt-12 grid md:grid-cols-3 gap-4">
          <div className="glass-effect rounded-xl p-4 text-center">
            <p className="text-purple-300 font-semibold">⚡ Instant</p>
            <p className="text-slate-300 text-sm mt-2">Generate previews in seconds</p>
          </div>
          <div className="glass-effect rounded-xl p-4 text-center">
            <p className="text-purple-300 font-semibold">🎯 Free</p>
            <p className="text-slate-300 text-sm mt-2">No costs, no API keys needed</p>
          </div>
          <div className="glass-effect rounded-xl p-4 text-center">
            <p className="text-purple-300 font-semibold">🚀 Shareable</p>
            <p className="text-slate-300 text-sm mt-2">Deploy and share with anyone</p>
          </div>
        </div>
      </div>
    </div>
  );
              }
