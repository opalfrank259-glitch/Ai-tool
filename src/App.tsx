import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { DashboardView } from './components/DashboardView';
import { BriefBuilder } from './components/BriefBuilder';
import { ConceptGallery } from './components/ConceptGallery';
import { BlueprintView } from './components/BlueprintView';
import { LearnWorkspace } from './components/LearnWorkspace';
import { QAReviewView } from './components/QAReviewView';
import { DeliveryView } from './components/DeliveryView';
import { ReferenceAnalyzerView } from './components/ReferenceAnalyzerView';
import { PracticeModeView } from './components/PracticeModeView';
import { AdminView } from './components/AdminView';
import { NewProjectModal } from './components/NewProjectModal';
import { VerificationModal } from './components/VerificationModal';
import { SettingsModal } from './components/SettingsModal';
import { LandingView } from './components/LandingView';
import { Project, Language, ProjectMode } from './types';
import { api, SEED_PROJECT } from './services/api';
import { AuthGate } from './components/AuthGate';

function WorkspaceApp() {
  const [currentView, setCurrentView] = useState<string>('dashboard');
  const [language, setLanguage] = useState<Language>('ur-roman');
  const [projects, setProjects] = useState<Project[]>([]);
  const [activeProjectId, setActiveProjectId] = useState<string>('');
  const [credits, setCredits] = useState<number>(0);

  // Modals
  const [showNewModal, setShowNewModal] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [verificationStepId, setVerificationStepId] = useState<string | null>(null);

  // Load initial data
  useEffect(() => {
    refreshData();
  }, []);

  // Sync RTL direction
  useEffect(() => {
    if (language === 'ur') {
      document.documentElement.dir = 'rtl';
      document.documentElement.lang = 'ur';
    } else {
      document.documentElement.dir = 'ltr';
      document.documentElement.lang = language === 'ur-roman' ? 'en' : language;
    }
  }, [language]);

  const refreshData = async () => {
    const p = await api.getProjects();
    setProjects(p);
    const cr = await api.getCredits();
    setCredits(cr.balance);
    const prof = await api.getProfile();
    setLanguage(prof.language);
  };

  const activeProject = projects.find((p) => p.id === activeProjectId) || projects[0] || null;

  const handleOpenProject = (id: string) => {
    setActiveProjectId(id);
    const proj = projects.find((p) => p.id === id) || (id === SEED_PROJECT.id ? SEED_PROJECT : null);
    if (!proj) return;
    if (id === SEED_PROJECT.id) {
      setProjects((previous) => previous.some((item) => item.id === id) ? previous : [SEED_PROJECT, ...previous]);
    }

    // Route to appropriate stage depending on status
    if (proj.status === 'draft') setCurrentView('brief');
    else if (proj.status === 'brief_approved') setCurrentView('concepts');
    else if (proj.status === 'concept_approved') setCurrentView('blueprint');
    else if (proj.status === 'blueprint_ready' || proj.status === 'learning') setCurrentView('learn');
    else if (proj.status === 'review') setCurrentView('review');
    else if (proj.status === 'delivered') setCurrentView('delivery');
    else setCurrentView('learn');
  };

  const handleCreateProject = async (ideaText: string, mode: ProjectMode) => {
    setShowNewModal(false);
    const newProj = await api.createProject(ideaText, mode);
    setActiveProjectId(newProj.id);
    await refreshData();
    setCurrentView('brief');
  };

  const handleDeleteProject = async (id: string) => {
    if (confirm('Delete this project?')) {
      await api.deleteProject(id);
      await refreshData();
      if (activeProjectId === id) {
        setCurrentView('dashboard');
      }
    }
  };

  const handleUpdateProject = (updated: Project) => {
    setProjects((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
    api.getCredits().then((c) => setCredits(c.balance));
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans antialiased selection:bg-amber-500 selection:text-slate-950">
      {/* Global Header */}
      <Header
        currentView={currentView}
        onNavigate={setCurrentView}
        language={language}
        onLanguageChange={setLanguage}
        credits={credits}
        activeProject={activeProject}
        onOpenSettings={() => setShowSettings(true)}
      />

      {/* Main View Router */}
      <main className="flex-1 p-4 sm:p-6 lg:p-8">
        {currentView === 'landing' && (
          <LandingView
            language={language}
            onStartProject={() => setShowNewModal(true)}
            onExploreDemo={() => handleOpenProject(SEED_PROJECT.id)}
          />
        )}

        {currentView === 'dashboard' && (
          <DashboardView
            projects={projects}
            language={language}
            onOpenProject={handleOpenProject}
            onNewProject={() => setShowNewModal(true)}
            onDeleteProject={handleDeleteProject}
          />
        )}

        {currentView === 'brief' && activeProject && (
          <BriefBuilder
            project={activeProject}
            language={language}
            onBriefApproved={handleUpdateProject}
            onProceedToConcepts={() => setCurrentView('concepts')}
          />
        )}

        {currentView === 'concepts' && activeProject && (
          <ConceptGallery
            project={activeProject}
            language={language}
            onConceptApproved={handleUpdateProject}
            onProceedToBlueprint={() => setCurrentView('blueprint')}
          />
        )}

        {currentView === 'blueprint' && activeProject && (
          <BlueprintView
            project={activeProject}
            language={language}
            onStartLearning={() => {
              if (!activeProject.steps || activeProject.steps.length === 0) {
                api.generateLessons(activeProject.id).then((steps) => {
                  handleUpdateProject({ ...activeProject, steps });
                  setCurrentView('learn');
                });
              } else {
                setCurrentView('learn');
              }
            }}
          />
        )}

        {currentView === 'learn' && activeProject && (
          <LearnWorkspace
            project={activeProject}
            language={language}
            onUpdateStep={handleUpdateProject}
            onOpenVerification={(stepId) => setVerificationStepId(stepId)}
            onProceedToQA={() => setCurrentView('review')}
          />
        )}

        {currentView === 'review' && activeProject && (
          <QAReviewView
            project={activeProject}
            language={language}
            onProceedToDelivery={() => setCurrentView('delivery')}
          />
        )}

        {currentView === 'delivery' && activeProject && (
          <DeliveryView
            project={activeProject}
            language={language}
            onBackToDashboard={() => setCurrentView('dashboard')}
          />
        )}

        {currentView === 'reference-analyzer' && (
          <ReferenceAnalyzerView
            language={language}
            onStartFromReference={() => {
              setShowNewModal(true);
            }}
          />
        )}

        {currentView === 'practice' && <PracticeModeView language={language} />}

        {currentView === 'admin' && <AdminView language={language} />}
      </main>

      {/* Modals */}
      {showNewModal && (
        <NewProjectModal
          language={language}
          onClose={() => setShowNewModal(false)}
          onCreateProject={handleCreateProject}
        />
      )}

      {verificationStepId && activeProject && (
        <VerificationModal
          project={activeProject}
          stepId={verificationStepId}
          onClose={() => setVerificationStepId(null)}
          onVerificationComplete={handleUpdateProject}
        />
      )}

      {showSettings && (
        <SettingsModal
          onClose={() => setShowSettings(false)}
          onLanguageChange={setLanguage}
        />
      )}
    </div>
  );
}


export default function App() {
  return <AuthGate><WorkspaceApp /></AuthGate>;
}
