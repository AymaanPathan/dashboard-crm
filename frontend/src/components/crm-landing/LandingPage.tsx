"use client";
import React, { useEffect } from "react";

import Navbar from "./Navbar";
import { HeroSection } from "./HeroSection";
import { FeaturesSection } from "./FeaturesSection";
import { PricingSection } from "./PricingSection";
import { crmFeatures } from "@/assets/landing-page-data/crmFeatures";
import { crmPricingPlans } from "@/assets/landing-page-data/crmPricing";
import { RootDispatch } from "@/store";
import { useDispatch } from "react-redux";
import { getOrganizationInfo } from "@/store/slices/orgSlice";

const LandingPage = () => {
  const dispatch: RootDispatch = useDispatch();
  useEffect(() => {
    const getOrganizationData = async (): Promise<void> => {
      await dispatch(getOrganizationInfo());
    };
    getOrganizationData();
  }, [dispatch]);

  const renderLanding = () => (
    <div className="min-h-screen bg-white">
      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(32px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        html {
          scroll-behavior: smooth;
        }
      `}</style>
      <Navbar />
      <HeroSection />
      <FeaturesSection features={crmFeatures} />
      <PricingSection pricingPlans={crmPricingPlans} />
    </div>
  );

  return renderLanding();
};

export default LandingPage;
