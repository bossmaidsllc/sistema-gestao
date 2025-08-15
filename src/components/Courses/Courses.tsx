import React, { useState } from 'react';
import { Play, Clock, CheckCircle, Lock, BookOpen, TrendingUp, Users, Target, ArrowLeft, PlayCircle } from 'lucide-react';
import { Course } from '../../types';

export default function Courses() {
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [currentModule, setCurrentModule] = useState<number | null>(null);
  const [completedModules, setCompletedModules] = useState<number[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);

  const courses: Course[] = [
    {
      id: '1',
      title: 'Google Ads para Empresas de Limpeza',
      description: 'Aprenda a criar campanhas eficazes no Google Ads e conseguir leads qualificados para sua empresa de limpeza.',
      modules: 8,
      duration: '2h 30min',
      thumbnail: 'https://images.pexels.com/photos/267350/pexels-photo-267350.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      completed: completedModules.length === 8
    },
    {
      id: '2',
      title: 'Marketing Local e Networking',
      description: 'Estratégias para se destacar na sua região e criar uma rede de contatos que gera novos clientes constantemente.',
      modules: 6,
      duration: '1h 45min',
      thumbnail: 'https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      completed: false
    },
    {
      id: '3',
      title: 'Precificação e Vendas',
      description: 'Como calcular seus preços de forma competitiva e técnicas de venda para converter mais leads em clientes.',
      modules: 5,
      duration: '1h 20min',
      thumbnail: 'https://images.pexels.com/photos/3760067/pexels-photo-3760067.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      completed: false
    },
    {
      id: '4',
      title: 'Instagram e Facebook para Limpeza',
      description: 'Use as redes sociais para mostrar seu trabalho, conquistar seguidores e atrair novos clientes.',
      modules: 7,
      duration: '2h 15min',
      thumbnail: 'https://images.pexels.com/photos/267371/pexels-photo-267371.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      completed: false
    }
  ];

  const modules = [
    { id: 1, title: 'Introdução ao Google Ads', duration: '15min', completed: completedModules.includes(1), locked: false },
    { id: 2, title: 'Configurando sua primeira campanha', duration: '25min', completed: completedModules.includes(2), locked: !completedModules.includes(1) },
    { id: 3, title: 'Palavras-chave para limpeza', duration: '20min', completed: completedModules.includes(3), locked: !completedModules.includes(2) },
    { id: 4, title: 'Criando anúncios que convertem', duration: '30min', completed: completedModules.includes(4), locked: !completedModules.includes(3) },
    { id: 5, title: 'Definindo orçamento e lances', duration: '18min', completed: completedModules.includes(5), locked: !completedModules.includes(4) },
    { id: 6, title: 'Extensões de anúncio', duration: '12min', completed: completedModules.includes(6), locked: !completedModules.includes(5) },
    { id: 7, title: 'Análise de resultados', duration: '20min', completed: completedModules.includes(7), locked: !completedModules.includes(6) },
    { id: 8, title: 'Otimização avançada', duration: '25min', completed: completedModules.includes(8), locked: !completedModules.includes(7) }
  ];

  const handleModuleComplete = (moduleId: number) => {
    if (!completedModules.includes(moduleId)) {
      setCompletedModules(prev => [...prev, moduleId]);
    }
    setIsPlaying(false);
    setCurrentModule(null);
  };

  const handlePlayModule = (moduleId: number) => {
    setCurrentModule(moduleId);
    setIsPlaying(true);
  };

  return (
    <div className="p-3 md:p-6">
      {!selectedCourse && !currentModule ? (
        <>
          {/* Header */}
          <div className="text-center mb-6 md:mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">Cursos e Treinamentos</h2>
            <p className="text-sm md:text-base text-gray-600 max-w-2xl mx-auto px-4">
              Aprenda estratégias comprovadas para fazer sua empresa de limpeza crescer. 
              Cursos práticos criados especialmente para o mercado americano.
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6 mb-6 md:mb-8">
            {[
              { icon: BookOpen, label: 'Cursos Disponíveis', value: '12', color: 'text-blue-600', bg: 'bg-blue-100' },
              { icon: Clock, label: 'Horas de Conteúdo', value: '24h', color: 'text-green-600', bg: 'bg-green-100' },
              { icon: Users, label: 'Alunas Ativas', value: '2,847', color: 'text-purple-600', bg: 'bg-purple-100' },
              { icon: TrendingUp, label: 'Taxa de Sucesso', value: '87%', color: 'text-pink-600', bg: 'bg-pink-100' }
            ].map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div key={index} className="bg-white rounded-lg p-3 md:p-6 shadow-md text-center">
                  <div className={`w-8 h-8 md:w-12 md:h-12 ${stat.bg} rounded-lg flex items-center justify-center mx-auto mb-2 md:mb-3`}>
                    <Icon className={stat.color} size={16} className="md:w-6 md:h-6" />
                  </div>
                  <p className="text-lg md:text-2xl font-bold text-gray-800">{stat.value}</p>
                  <p className="text-xs md:text-sm text-gray-600">{stat.label}</p>
                </div>
              );
            })}
          </div>

          {/* Courses Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            {courses.map((course) => (
              <div
                key={course.id}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => setSelectedCourse(course)}
              >
                <div className="relative">
                  <img
                    src={course.thumbnail}
                    alt={course.title}
                    className="w-full h-32 md:h-48 object-cover"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                    <div className="w-12 h-12 md:w-16 md:h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                      <Play className="text-white ml-1" size={20} className="md:w-6 md:h-6" />
                    </div>
                  </div>
                  {course.completed && (
                    <div className="absolute top-2 right-2 md:top-4 md:right-4 bg-green-500 text-white p-1.5 md:p-2 rounded-full">
                      <CheckCircle size={14} className="md:w-4 md:h-4" />
                    </div>
                  )}
                </div>
                
                <div className="p-4 md:p-6">
                  <h3 className="text-lg md:text-xl font-bold text-gray-800 mb-2">{course.title}</h3>
                  <p className="text-sm md:text-base text-gray-600 mb-3 md:mb-4">{course.description}</p>
                  
                  <div className="flex justify-between items-center text-xs md:text-sm text-gray-500 mb-3 md:mb-4">
                    <span>{course.modules} módulos</span>
                    <span>{course.duration}</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <div className={`px-2 md:px-3 py-1 rounded-full text-xs md:text-sm font-medium ${
                      course.completed 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-blue-100 text-blue-800'
                    }`}>
                      {course.completed ? 'Concluído' : 'Disponível'}
                    </div>
                    
                    <button className="bg-pink-500 hover:bg-pink-600 text-white px-3 md:px-4 py-1.5 md:py-2 rounded-lg transition-colors text-sm">
                      {course.completed ? 'Revisar' : 'Começar'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Coming Soon */}
          <div className="mt-8 md:mt-12 bg-gradient-to-r from-pink-500 to-pink-600 rounded-lg p-6 md:p-8 text-white text-center">
            <Target size={32} className="mx-auto mb-4 md:w-12 md:h-12" />
            <h3 className="text-xl md:text-2xl font-bold mb-2">Mais Cursos em Breve!</h3>
            <p className="mb-4 text-sm md:text-base">
              Estamos preparando novos treinamentos sobre gestão de equipe, 
              expansion de negócios e muito mais.
            </p>
            <button className="bg-white text-pink-600 px-4 md:px-6 py-2 md:py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors text-sm md:text-base">
              Receber Notificações
            </button>
          </div>
        </>
      ) : currentModule ? (
        // Module Player View
        <div>
          <div className="flex items-center justify-between mb-4 md:mb-6">
            <button
              onClick={() => {
                setCurrentModule(null);
                setIsPlaying(false);
              }}
              className="text-gray-600 hover:text-gray-800 flex items-center text-sm md:text-base"
            >
              <ArrowLeft size={18} className="mr-2" />
              Voltar ao Curso
            </button>
          </div>

          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            {/* Video Player Simulation */}
            <div className="bg-black aspect-video flex items-center justify-center relative">
              {!isPlaying ? (
                <button
                  onClick={() => setIsPlaying(true)}
                  className="w-16 h-16 md:w-20 md:h-20 bg-pink-500 rounded-full flex items-center justify-center hover:bg-pink-600 transition-colors"
                >
                  <Play className="text-white ml-1" size={24} className="md:w-8 md:h-8" />
                </button>
              ) : (
                <div className="text-white text-center">
                  <div className="animate-pulse mb-4">
                    <PlayCircle size={48} className="mx-auto md:w-16 md:h-16" />
                  </div>
                  <p className="text-sm md:text-base">Reproduzindo: {modules.find(m => m.id === currentModule)?.title}</p>
                  <div className="mt-4 bg-white bg-opacity-20 rounded-full h-1 w-64 mx-auto">
                    <div className="bg-pink-500 h-1 rounded-full w-1/3"></div>
                  </div>
                </div>
              )}
            </div>

            <div className="p-4 md:p-6">
              <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-2">
                {modules.find(m => m.id === currentModule)?.title}
              </h2>
              <p className="text-gray-600 mb-4 text-sm md:text-base">
                Duração: {modules.find(m => m.id === currentModule)?.duration}
              </p>
              
              <div className="flex space-x-3">
                <button
                  onClick={() => handleModuleComplete(currentModule)}
                  className="bg-green-500 hover:bg-green-600 text-white px-4 md:px-6 py-2 md:py-3 rounded-lg font-medium transition-colors text-sm md:text-base"
                >
                  Marcar como Concluído
                </button>
                
                <button
                  onClick={() => {
                    const nextModule = currentModule + 1;
                    if (nextModule <= modules.length) {
                      setCurrentModule(nextModule);
                      setIsPlaying(false);
                    }
                  }}
                  className="bg-pink-500 hover:bg-pink-600 text-white px-4 md:px-6 py-2 md:py-3 rounded-lg font-medium transition-colors text-sm md:text-base"
                >
                  Próximo Módulo
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : selectedCourse ? (
        // Course Detail View
        <div>
          {/* Header */}
          <div className="flex items-center justify-between mb-4 md:mb-6">
            <button
              onClick={() => setSelectedCourse(null)}
              className="text-gray-600 hover:text-gray-800 flex items-center text-sm md:text-base"
            >
              <ArrowLeft size={18} className="mr-2" />
              Voltar aos Cursos
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
            {/* Course Info */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <img
                  src={selectedCourse.thumbnail}
                  alt={selectedCourse.title}
                  className="w-full h-48 md:h-64 object-cover"
                />
                <div className="p-4 md:p-6">
                  <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-3 md:mb-4">{selectedCourse.title}</h1>
                  <p className="text-sm md:text-base text-gray-600 mb-4 md:mb-6">{selectedCourse.description}</p>
                  
                  <div className="flex items-center space-x-4 md:space-x-6 mb-4 md:mb-6 text-sm md:text-base">
                    <div className="flex items-center text-gray-600">
                      <BookOpen size={18} className="mr-2" />
                      <span>{selectedCourse.modules} módulos</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <Clock size={18} className="mr-2" />
                      <span>{selectedCourse.duration}</span>
                    </div>
                  </div>

                  <button 
                    onClick={() => handlePlayModule(1)}
                    className="w-full bg-pink-500 hover:bg-pink-600 text-white py-2 md:py-3 px-4 md:px-6 rounded-lg font-medium transition-colors text-sm md:text-base"
                  >
                    Começar Curso
                  </button>
                </div>
              </div>
            </div>

            {/* Modules List */}
            <div>
              <div className="bg-white rounded-lg shadow-md p-4 md:p-6">
                <h3 className="text-lg md:text-xl font-bold text-gray-800 mb-3 md:mb-4">Módulos do Curso</h3>
                
                <div className="space-y-2 md:space-y-3">
                  {modules.map((module) => (
                    <div
                      key={module.id}
                      onClick={() => !module.locked && handlePlayModule(module.id)}
                      className={`flex items-center justify-between p-2 md:p-3 rounded-lg border cursor-pointer ${
                        module.locked 
                          ? 'bg-gray-50 border-gray-200' 
                          : 'bg-blue-50 border-blue-200 hover:bg-blue-100'
                      }`}
                    >
                      <div className="flex items-center space-x-2 md:space-x-3 flex-1 min-w-0">
                        <div className={`w-6 h-6 md:w-8 md:h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                          module.completed 
                            ? 'bg-green-500' 
                            : module.locked 
                            ? 'bg-gray-300' 
                            : 'bg-blue-500'
                        }`}>
                          {module.completed ? (
                            <CheckCircle className="text-white" size={12} className="md:w-4 md:h-4" />
                          ) : module.locked ? (
                            <Lock className="text-gray-500" size={12} className="md:w-4 md:h-4" />
                          ) : (
                            <Play className="text-white" size={12} className="md:w-4 md:h-4" />
                          )}
                        </div>
                        
                        <div className="min-w-0 flex-1">
                          <p className={`font-medium text-sm md:text-base truncate ${
                            module.locked ? 'text-gray-500' : 'text-gray-800'
                          }`}>
                            {module.title}
                          </p>
                          <p className="text-xs md:text-sm text-gray-500">{module.duration}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}