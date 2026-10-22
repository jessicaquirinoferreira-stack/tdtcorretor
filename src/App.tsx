import React, { useState, useEffect } from 'react';
import { Property, Lead, LandingPageData } from './types';
import {
  getProperties,
  getLeads,
  getLandingPages,
  getPropertyBySlug,
  subscribeToProperties,
  subscribeToLeads,
} from './lib/storage';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { WhatsAppButton } from './components/WhatsAppButton';
import { VirtualAssistant } from './components/VirtualAssistant';
import { HomePage } from './pages/HomePage';
import { PropertiesPage } from './pages/PropertiesPage';
import { PropertyDetailPage } from './pages/PropertyDetailPage';
import { BuyPage } from './pages/BuyPage';
import { SellPage } from './pages/SellPage';
import { RentPage } from './pages/RentPage';
import { SubmitPropertyPage } from './pages/SubmitPropertyPage';
import { FinancingPage } from './pages/FinancingPage';
import { ServicesPage } from './pages/ServicesPage';
import { AboutPage } from './pages/AboutPage';
import { ContactPage } from './pages/ContactPage';
import { LandingPage } from './pages/LandingPage';
import { PrivacyPolicyPage } from './pages/PrivacyPolicyPage';
import { TermsPage } from './pages/TermsPage';
import { AdminPage } from './pages/AdminPage';

export default function App() {
  const [currentPath, setCurrentPath] = useState<string>(() => {
    return window.location.pathname || '/';
  });
  const [properties, setProperties] = useState<Property[]>(() => getProperties());
  const [leads, setLeads] = useState<Lead[]>(() => getLeads());
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [filterParams, setFilterParams] = useState<Record<string, string>>({});

  // Real-time synchronization with Cloud Firestore for all visitors and admin
  useEffect(() => {
    const unsubProperties = subscribeToProperties((cloudProps) => {
      setProperties(cloudProps);
    });

    const unsubLeads = subscribeToLeads((cloudLeads) => {
      setLeads(cloudLeads);
    });

    return () => {
      unsubProperties();
      unsubLeads();
    };
  }, []);

  // Sync with browser history
  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname || '/');
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigate = (path: string, filters?: Record<string, string>) => {
    if (filters) {
      setFilterParams(filters);
    } else {
      setFilterParams({});
    }

    if (path.startsWith('/imoveis/')) {
      const slug = path.replace('/imoveis/', '');
      const prop = getPropertyBySlug(slug);
      if (prop) setSelectedProperty(prop);
    } else if (path !== '/imoveis') {
      setSelectedProperty(null);
    }

    window.history.pushState({}, '', path);
    setCurrentPath(path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const refreshData = () => {
    setProperties(getProperties());
    setLeads(getLeads());
  };

  // Check if viewing a landing page: /landing/:slug
  if (currentPath.startsWith('/landing/')) {
    const slug = currentPath.replace('/landing/', '');
    const landings = getLandingPages();
    const landing = landings.find((l) => l.slug === slug);
    const matchedProp = landing
      ? properties.find((p) => p.id === landing.propertyId)
      : properties.find((p) => p.slug === slug);

    if (landing && matchedProp) {
      return (
        <div className="min-h-screen flex flex-col font-sans">
          <LandingPage
            landing={landing}
            property={matchedProp}
            onNavigateHome={() => navigate('/')}
          />
          <VirtualAssistant />
          <WhatsAppButton />
          <Footer onNavigate={navigate} />
        </div>
      );
    }
  }

  // Check if viewing an individual property: /imoveis/:slug
  if (currentPath.startsWith('/imoveis/') && currentPath !== '/imoveis') {
    const slug = currentPath.replace('/imoveis/', '');
    const prop = selectedProperty || getPropertyBySlug(slug) || properties.find((p) => p.slug === slug);

    if (prop) {
      return (
        <div className="min-h-screen flex flex-col bg-[#F8F9FA] font-sans">
          <Header currentPath={currentPath} onNavigate={navigate} />
          <main className="flex-1">
            <PropertyDetailPage
              property={prop}
              allProperties={properties}
              onSelectProperty={(p) => navigate(`/imoveis/${p.slug}`)}
              onBack={() => navigate('/imoveis')}
            />
          </main>
          <VirtualAssistant />
          <WhatsAppButton />
          <Footer onNavigate={navigate} />
        </div>
      );
    }
  }

  // Render pages based on path
  const renderCurrentPage = () => {
    switch (currentPath) {
      case '/':
        return (
          <HomePage
            properties={properties}
            onSelectProperty={(p) => navigate(`/imoveis/${p.slug}`)}
            onNavigate={navigate}
          />
        );

      case '/imoveis':
        return (
          <PropertiesPage
            properties={properties}
            onSelectProperty={(p) => navigate(`/imoveis/${p.slug}`)}
            initialFilters={filterParams}
          />
        );

      case '/comprar':
        return <BuyPage onNavigate={navigate} />;

      case '/vender':
        return <SellPage onNavigate={navigate} />;

      case '/alugar':
        return <RentPage onNavigate={navigate} />;

      case '/anunciar-imovel':
        return <SubmitPropertyPage />;

      case '/financiamento':
        return <FinancingPage />;

      case '/servicos':
        return <ServicesPage onNavigate={navigate} />;

      case '/sobre':
        return <AboutPage />;

      case '/contato':
        return <ContactPage />;

      case '/privacidade':
        return <PrivacyPolicyPage />;

      case '/termos':
        return <TermsPage />;

      case '/admin':
        return (
          <AdminPage
            properties={properties}
            leads={leads}
            onRefreshData={refreshData}
            onNavigateHome={() => navigate('/')}
            onPreviewProperty={(p) => navigate(`/imoveis/${p.slug}`)}
            onPreviewLanding={(slug) => navigate(`/landing/${slug}`)}
          />
        );

      default:
        return (
          <HomePage
            properties={properties}
            onSelectProperty={(p) => navigate(`/imoveis/${p.slug}`)}
            onNavigate={navigate}
          />
        );
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F8F9FA] text-[#1A2621] font-sans selection:bg-[#C8A251]/20 selection:text-[#0B2B20]">
      {/* Header displayed across all main pages */}
      <Header currentPath={currentPath} onNavigate={navigate} />

      {/* Main Content Area */}
      <main className="flex-1">
        {renderCurrentPage()}
      </main>

      {/* Virtual Assistant Floating on the Left Side */}
      <VirtualAssistant />

      {/* Floating WhatsApp Button */}
      <WhatsAppButton />

      {/* Sophisticated Footer with discreet Admin link */}
      <Footer onNavigate={navigate} />
    </div>
  );
}
