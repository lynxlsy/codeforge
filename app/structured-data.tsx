export function StructuredData() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "CodeForge",
    "alternateName": "CDforge",
    "url": "https://cdforge.shop",
    "logo": "https://cdforge.shop/logo.svg",
    "description": "Transformamos suas ideias em soluções digitais inovadoras. Especialistas em bots inteligentes, sites profissionais e automações avançadas.",
    "foundingDate": "2024",
    "address": {
      "@type": "PostalAddress",
      "addressCountry": "BR"
    },
    "contactPoint": {
      "@type": "ContactPoint",
      "contactType": "customer service",
      "availableLanguage": ["Portuguese", "English"]
    },
    "sameAs": [
      "https://github.com/lynxlsy/codeforge"
    ],
    "serviceType": [
      "Desenvolvimento de Bots",
      "Criação de Sites",
      "Automação de Processos",
      "Serviços Digitais"
    ],
    "areaServed": "Brasil",
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "Serviços CodeForge",
      "itemListElement": [
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Bots Inteligentes",
            "description": "Automação inteligente para seu negócio"
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Sites Profissionais",
            "description": "Sites modernos e responsivos"
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Automações Avançadas",
            "description": "Processos automatizados e eficientes"
          }
        }
      ]
    }
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(structuredData),
      }}
    />
  );
}
