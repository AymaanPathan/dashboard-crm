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
import { Footer } from "./Footer";

const LandingPage = () => {
  const dispatch: RootDispatch = useDispatch();
  useEffect(() => {
    const getOrganizationData = async (): Promise<void> => {
      await dispatch(getOrganizationInfo());
    };
    getOrganizationData();
  }, [dispatch]);

  const renderLanding = () => (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <HeroSection />
      <FeaturesSection features={crmFeatures} />
      <PricingSection pricingPlans={crmPricingPlans} />
      <Footer/>
    </div>
  );

  return renderLanding();
};

export default LandingPage;
