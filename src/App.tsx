/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef } from 'react';
import { Camera, Upload, Leaf, AlertCircle, CheckCircle2, XCircle, RefreshCw, ArrowRight, Building2, BarChart3, ShieldCheck, Star, Menu, X, Award, Sparkles, UploadCloud } from 'lucide-react';
import { analyzeImage, compressImage } from './lib/gemini';
import { ClassificationResult } from './types';

// Using the provided API key
const GEMINI_API_KEY = "AIzaSyDbqQ6yu_SCJa4lYHfs8b7HVB7pc3-RZkI";

export default function App() {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<ClassificationResult | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [demoPoints, setDemoPoints] = useState(0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const demoRef = useRef<HTMLDivElement>(null);

  const scrollToDemo = () => {
    demoRef.current?.scrollIntoView({ behavior: 'smooth' });
    setIsMobileMenuOpen(false);
  };

  const processFile = async (file: File) => {
    try {
      setError(null);
      setIsAnalyzing(true);
      setResult(null);

      // Show preview immediately
      const previewUrl = URL.createObjectURL(file);
      setSelectedImage(previewUrl);

      // Compress and analyze
      const compressedBase64 = await compressImage(file);
      const analysisResult = await analyzeImage(compressedBase64, GEMINI_API_KEY);
      
      setResult(analysisResult);

      if (analysisResult.es_correcto) {
        setDemoPoints(prev => prev + analysisResult.puntos);
      }

    } catch (err) {
      console.error(err);
      setError("Hubo un error al analizar la imagen. Por favor, inténtalo de nuevo.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    await processFile(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
      await processFile(file);
    } else {
      setError("Por favor, sube un archivo de imagen válido.");
    }
  };

  const resetClassification = () => {
    setResult(null);
    setSelectedImage(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 selection:bg-emerald-200 overflow-x-hidden">
      {/* Navbar */}
      <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-md z-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-5 md:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-emerald-500 p-2 rounded-lg">
              <Leaf className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-heading font-bold tracking-tight text-emerald-950">ECOIA</span>
          </div>
          
          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8 font-medium text-sm text-slate-600">
            <a href="#quienes-somos" className="hover:text-emerald-600 transition-colors">Quiénes Somos</a>
            <a href="#soluciones" className="hover:text-emerald-600 transition-colors">Soluciones</a>
            <a href="#certificacion" className="hover:text-emerald-600 transition-colors">Certificación</a>
            <button onClick={scrollToDemo} className="bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-full transition-all shadow-sm hover:shadow-md font-semibold min-h-[48px]">
              Probar Demo AI
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} 
              className="text-slate-600 hover:text-emerald-600 p-2 min-h-[48px] min-w-[48px] flex items-center justify-center"
              aria-label="Menú principal"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-white border-b border-slate-200 px-5 py-4 flex flex-col gap-4 shadow-lg absolute w-full">
            <a href="#quienes-somos" onClick={() => setIsMobileMenuOpen(false)} className="text-slate-600 font-medium py-2 text-lg">Quiénes Somos</a>
            <a href="#soluciones" onClick={() => setIsMobileMenuOpen(false)} className="text-slate-600 font-medium py-2 text-lg">Soluciones</a>
            <a href="#certificacion" onClick={() => setIsMobileMenuOpen(false)} className="text-slate-600 font-medium py-2 text-lg">Certificación</a>
            <button onClick={scrollToDemo} className="w-full bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-3 rounded-xl transition-all shadow-sm font-semibold min-h-[48px] text-lg mt-2">
              Probar Demo AI
            </button>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-12 md:pb-20 px-5 md:px-8 max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-12">
        <div className="flex-1 text-center lg:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-sm font-semibold mb-6">
            <ShieldCheck className="w-4 h-4" />
            Certificación Ambiental Institucional
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-extrabold tracking-tight text-slate-900 mb-6 leading-tight">
            Inteligencia Artificial para un futuro <span className="text-emerald-600">sostenible</span>.
          </h1>
          <p className="text-lg text-slate-600 mb-8 max-w-2xl mx-auto lg:mx-0">
            Automatiza las auditorías de residuos, educa a tu personal en tiempo real y obtén la Certificación ECOIA para tu institución. La tecnología al servicio del planeta.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
            <button className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-4 rounded-full font-bold text-lg transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2 min-h-[48px]">
              Solicitar Certificación
              <ArrowRight className="w-5 h-5" />
            </button>
            <button onClick={scrollToDemo} className="w-full sm:w-auto bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 px-8 py-4 rounded-full font-bold text-lg transition-all flex items-center justify-center gap-2 min-h-[48px]">
              Ver Demo
            </button>
          </div>
        </div>
        <div className="flex-1 w-full max-w-lg lg:max-w-none relative">
          <div className="absolute inset-0 bg-gradient-to-tr from-emerald-200 to-teal-50 rounded-3xl transform rotate-3 scale-105 -z-10"></div>
          <img 
            src="https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&q=80&w=800" 
            alt="Reciclaje corporativo" 
            className="rounded-3xl shadow-2xl object-cover aspect-[4/3] w-full" 
            referrerPolicy="no-referrer" 
          />
        </div>
      </section>

      {/* Quiénes Somos */}
      <section id="quienes-somos" className="py-12 md:py-20 px-5 md:px-8 bg-slate-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-slate-900 mb-6">Somos EcoIA</h2>
            <p className="text-lg text-slate-600 max-w-3xl mx-auto leading-relaxed">
              En EcoIA, fusionamos la innovación tecnológica con el compromiso ambiental. Nuestro propósito nació de una observación fundamental: la intención de reciclar existe, pero la complejidad del proceso y la falta de información inmediata generan barreras. Para resolverlo, hemos desarrollado una solución basada en Inteligencia Artificial que elimina la incertidumbre, transformando la clasificación de residuos en una experiencia precisa, educativa y gratificante.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all">
              <div className="text-4xl mb-4">🤖</div>
              <h3 className="text-xl font-heading font-bold text-slate-900 mb-3">Tecnología real</h3>
              <p className="text-slate-600">IA de última generación que clasifica residuos con precisión. No es una lista, es inteligencia.</p>
            </div>
            <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all">
              <div className="text-4xl mb-4">🌱</div>
              <h3 className="text-xl font-heading font-bold text-slate-900 mb-3">Impacto medible</h3>
              <p className="text-slate-600">Cada clasificación genera datos reales de impacto ambiental para tu organización.</p>
            </div>
            <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all">
              <div className="text-4xl mb-4">🏆</div>
              <h3 className="text-xl font-heading font-bold text-slate-900 mb-3">Hábitos que duran</h3>
              <p className="text-slate-600">Los puntos y rankings convierten una acción en un hábito sostenible en el tiempo.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Misión y Visión */}
      <section id="mision-vision" className="py-12 md:py-20 px-5 md:px-8" style={{ backgroundColor: '#1A5C38' }}>
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
            <div className="bg-white/10 backdrop-blur-sm p-8 md:p-10 rounded-2xl border border-white/20">
              <div className="text-4xl mb-6">🎯</div>
              <h3 className="text-2xl font-heading font-bold text-white mb-4">Misión</h3>
              <p className="text-emerald-50 text-lg leading-relaxed">
                Hacer que reciclar bien sea tan fácil que cualquier persona lo haga bien desde el primer intento, sin capacitaciones ni carteles confusos.
              </p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm p-8 md:p-10 rounded-2xl border border-white/20">
              <div className="text-4xl mb-6">🌍</div>
              <h3 className="text-2xl font-heading font-bold text-white mb-4">Visión</h3>
              <p className="text-emerald-50 text-lg leading-relaxed">
                Un mundo donde cada empresa y universidad tenga datos reales de su impacto ambiental y una comunidad que compita por ser más sostenible cada día.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="soluciones" className="py-12 md:py-20 px-5 md:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-slate-900 mb-4">¿Por qué elegir ECOIA para tu institución?</h2>
            <p className="text-slate-600 max-w-2xl mx-auto text-lg">Nuestra plataforma integral facilita la transición hacia una economía circular dentro de tu organización.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            <div className="bg-slate-50 p-8 rounded-2xl border border-slate-100 hover:border-emerald-100 hover:shadow-md transition-all">
              <div className="bg-emerald-100 w-12 h-12 rounded-xl flex items-center justify-center mb-6">
                <Building2 className="w-6 h-6 text-emerald-700" />
              </div>
              <h3 className="text-xl font-heading font-bold text-slate-900 mb-3">Auditorías Automatizadas</h3>
              <p className="text-slate-600">Reemplaza los procesos manuales. Nuestra IA identifica y clasifica los residuos al instante, generando reportes precisos.</p>
            </div>
            <div className="bg-slate-50 p-8 rounded-2xl border border-slate-100 hover:border-blue-100 hover:shadow-md transition-all">
              <div className="bg-blue-100 w-12 h-12 rounded-xl flex items-center justify-center mb-6">
                <BarChart3 className="w-6 h-6 text-blue-700" />
              </div>
              <h3 className="text-xl font-heading font-bold text-slate-900 mb-3">Métricas en Tiempo Real</h3>
              <p className="text-slate-600">Visualiza el impacto ambiental de tu institución con dashboards detallados sobre la reducción de huella de carbono.</p>
            </div>
            <div className="bg-slate-50 p-8 rounded-2xl border border-slate-100 hover:border-purple-100 hover:shadow-md transition-all">
              <div className="bg-purple-100 w-12 h-12 rounded-xl flex items-center justify-center mb-6">
                <Award className="w-6 h-6 text-purple-700" />
              </div>
              <h3 className="text-xl font-heading font-bold text-slate-900 mb-3">Certificación ECOIA</h3>
              <p className="text-slate-600">Obtén nuestro sello de excelencia ambiental al cumplir con las metas de reciclaje y educación corporativa.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Demo Section */}
      <section ref={demoRef} id="demo" className="py-12 md:py-24 px-5 md:px-8 bg-slate-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1550989460-0adf9ea622e2?auto=format&fit=crop&q=80&w=2000')] opacity-10 bg-cover bg-center mix-blend-overlay"></div>
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">Prueba la tecnología detrás de ECOIA</h2>
            <p className="text-slate-400 max-w-2xl mx-auto text-lg">Sube una foto de un residuo y mira cómo nuestra Inteligencia Artificial lo clasifica en segundos. Así de fácil será para tus empleados.</p>
          </div>

          <div className="max-w-md mx-auto bg-white rounded-3xl overflow-hidden shadow-2xl text-slate-900">
            {/* Embedded App UI */}
            <div className="p-6">
              
              {/* Demo Points Header */}
              <div className="flex justify-between items-center mb-6 bg-slate-50 p-3 rounded-xl border border-slate-200">
                <span className="text-sm font-semibold text-slate-600">Puntos Demo</span>
                <div className="flex items-center gap-1.5 bg-emerald-100 px-3 py-1 rounded-full">
                  <Star className="w-4 h-4 text-emerald-600 fill-emerald-600" />
                  <span className="font-bold text-emerald-700">{demoPoints} pts</span>
                </div>
              </div>

              {!selectedImage ? (
                <div 
                  className={`flex flex-col items-center justify-center py-10 px-6 border-2 border-dashed rounded-2xl transition-all duration-300 ${
                    isDragging 
                      ? 'border-emerald-500 bg-emerald-50 scale-[1.02]' 
                      : 'border-slate-200 bg-slate-50 hover:border-emerald-300 hover:bg-emerald-50/50'
                  }`}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                >
                  <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 transition-colors duration-300 ${isDragging ? 'bg-emerald-200' : 'bg-emerald-100'}`}>
                    <UploadCloud className={`w-10 h-10 transition-colors duration-300 ${isDragging ? 'text-emerald-700' : 'text-emerald-600'}`} />
                  </div>
                  <h3 className="text-xl font-heading font-bold text-slate-800 mb-2">Demo de Clasificación</h3>
                  <p className="text-slate-500 mb-8 text-sm text-center">
                    Arrastra una imagen aquí o usa los botones. ¡Si la caneca correcta aparece de fondo, ganas puntos!
                  </p>
                  
                  <input
                    type="file"
                    accept="image/*"
                    capture="environment"
                    className="hidden"
                    ref={fileInputRef}
                    onChange={handleImageUpload}
                  />
                  
                  <div className="w-full flex flex-col gap-3">
                    <button 
                      onClick={() => fileInputRef.current?.click()}
                      className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3.5 px-4 rounded-xl transition-all hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-2 shadow-md min-h-[48px]"
                    >
                      <Camera className="w-5 h-5" />
                      Usar Cámara
                    </button>
                    
                    <button 
                      onClick={() => {
                        if (fileInputRef.current) {
                          fileInputRef.current.removeAttribute('capture');
                          fileInputRef.current.click();
                          fileInputRef.current.setAttribute('capture', 'environment');
                        }
                      }}
                      className="w-full bg-white border-2 border-slate-200 hover:bg-slate-50 hover:border-slate-300 text-slate-700 font-bold py-3.5 px-4 rounded-xl transition-all hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-2 min-h-[48px]"
                    >
                      <Upload className="w-5 h-5" />
                      Subir Imagen
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col gap-4">
                  <div className="relative rounded-2xl overflow-hidden shadow-inner border border-slate-200 bg-black aspect-square flex items-center justify-center">
                    <img 
                      src={selectedImage} 
                      alt="Residuo" 
                      className={`max-w-full max-h-full object-contain transition-opacity duration-300 ${isAnalyzing ? 'opacity-50' : 'opacity-100'}`}
                    />
                    
                    {isAnalyzing && (
                      <div className="absolute inset-0 flex flex-col items-center justify-center text-white bg-slate-900/70 backdrop-blur-sm transition-all duration-500 z-10 overflow-hidden">
                        {/* Scanning Line */}
                        <div className="absolute left-0 w-full h-1 bg-emerald-400 shadow-[0_0_20px_rgba(52,211,153,1)] animate-scan z-0"></div>
                        
                        <div className="relative z-10 flex flex-col items-center">
                          <div className="relative mb-4">
                            <div className="absolute inset-0 bg-emerald-500 blur-xl opacity-40 rounded-full animate-pulse"></div>
                            <Sparkles className="w-12 h-12 text-emerald-400 animate-pulse relative z-10" />
                          </div>
                          <p className="font-medium text-emerald-300 tracking-wide animate-pulse text-lg">Analizando residuo...</p>
                          <p className="text-xs text-slate-300 mt-2 font-medium">Identificando material y caneca</p>
                        </div>
                      </div>
                    )}
                  </div>

                  {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl flex items-start gap-3">
                      <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                      <p className="text-sm">{error}</p>
                    </div>
                  )}

                  {result && !isAnalyzing && (
                    <div className="bg-slate-50 rounded-2xl border border-slate-200 overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
                      <div className={`p-6 flex flex-col items-center justify-center text-center ${result.es_correcto ? 'bg-emerald-50' : 'bg-red-50'}`}>
                        {result.es_correcto ? (
                          <>
                            <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mb-4 shadow-sm">
                              <CheckCircle2 className="w-8 h-8 text-emerald-600" />
                            </div>
                            <h3 className="text-2xl font-heading font-bold text-emerald-800 mb-2">¡Correcto!</h3>
                            <p className="text-emerald-600 font-medium text-lg">+{result.puntos} Puntos</p>
                          </>
                        ) : (
                          <>
                            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4 shadow-sm">
                              <XCircle className="w-8 h-8 text-red-600" />
                            </div>
                            <h3 className="text-2xl font-heading font-bold text-red-800 mb-2">Incorrecto</h3>
                            <p className="text-red-600 font-medium text-lg">0 Puntos</p>
                            {result.color_sugerido && (
                              <p className="mt-3 text-slate-700 font-medium">
                                Debería ir en la caneca <span className="font-bold capitalize text-slate-900">{result.color_sugerido}</span>
                              </p>
                            )}
                            <p className="mt-1 text-sm text-slate-500">¡Inténtalo de nuevo la próxima vez!</p>
                          </>
                        )}
                      </div>
                      
                      {/* Explicación de la IA */}
                      {result.analisis_detallado ? (
                        <div className="p-6 bg-white border-t border-slate-200 text-left">
                          <h4 className="text-lg font-heading font-bold text-slate-800 mb-4 flex items-center gap-2">
                            <Leaf className="w-5 h-5 text-emerald-600" />
                            Análisis
                          </h4>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                            <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                              <span className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Material Detectado</span>
                              <span className="text-sm font-medium text-slate-700">{result.analisis_detallado.material}</span>
                            </div>
                            <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                              <span className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Estado del Residuo</span>
                              <span className="text-sm font-medium text-slate-700">{result.analisis_detallado.estado}</span>
                            </div>
                          </div>
                          <div className="bg-emerald-50/50 p-4 rounded-xl border border-emerald-100 mb-4">
                            <span className="block text-xs font-bold text-emerald-600 uppercase tracking-wider mb-1">¿Por qué va aquí?</span>
                            <p className="text-sm text-slate-700 leading-relaxed">
                              {result.analisis_detallado.motivo}
                            </p>
                          </div>
                          <div className="flex items-start gap-3 bg-blue-50/50 p-4 rounded-xl border border-blue-100">
                            <div className="bg-blue-100 p-1.5 rounded-lg shrink-0 mt-0.5">
                              <Sparkles className="w-4 h-4 text-blue-600" />
                            </div>
                            <div>
                              <span className="block text-xs font-bold text-blue-600 uppercase tracking-wider mb-1">Tip Ecológico</span>
                              <p className="text-sm text-slate-700 leading-relaxed">
                                {result.analisis_detallado.tip_ecologico}
                              </p>
                            </div>
                          </div>
                        </div>
                      ) : result.explicacion && (
                        <div className="p-5 bg-white border-t border-slate-200 text-left">
                          <h4 className="text-sm font-heading font-bold text-slate-800 mb-2 flex items-center gap-2">
                            <Leaf className="w-4 h-4 text-emerald-600" />
                            Análisis de la IA
                          </h4>
                          <p className="text-sm text-slate-600 leading-relaxed">
                            {result.explicacion}
                          </p>
                        </div>
                      )}
                    </div>
                  )}

                  {!isAnalyzing && (
                    <button 
                      onClick={resetClassification}
                      className="w-full bg-slate-900 hover:bg-black text-white font-bold py-3 px-4 rounded-xl transition-colors mt-2 min-h-[48px]"
                    >
                      Probar otra imagen
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-950 text-slate-400 py-12 px-5 md:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <Leaf className="w-6 h-6 text-emerald-500" />
            <span className="text-xl font-heading font-bold tracking-tight text-white">ECOIA</span>
          </div>
          <p className="text-sm text-center md:text-left">© {new Date().getFullYear()} ECOIA. Todos los derechos reservados.</p>
          <div className="flex flex-wrap justify-center gap-6 text-sm">
            <a href="#" className="hover:text-white transition-colors min-h-[48px] flex items-center">Privacidad</a>
            <a href="#" className="hover:text-white transition-colors min-h-[48px] flex items-center">Términos</a>
            <a href="#" className="hover:text-white transition-colors min-h-[48px] flex items-center">Contacto</a>
          </div>
        </div>
      </footer>
    </div>
  );
}


