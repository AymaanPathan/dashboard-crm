"use client";
import React, { useEffect } from "react";

import Navbar from "./Navbar";
import { HeroSection } from "./HeroSection";
import { FeaturesSection } from "./FeaturesSection";
import { PricingSection } from "./PricingSection";
import { TestimonialsSection } from "./TestimonialsSection";
import { CtaSection } from "./CTASection";
import { Footer } from "./Footer";
import { crmFeatures } from "@/assets/landing-page-data/crmFeatures";
import { crmPricingPlans } from "@/assets/landing-page-data/crmPricing";
import { crmTestimonials } from "@/assets/landing-page-data/crmTestimonials";
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
      <Navbar />
      <HeroSection />
      <FeaturesSection features={crmFeatures} />
      <PricingSection pricingPlans={crmPricingPlans} />
      <TestimonialsSection testimonials={crmTestimonials} />
      <CtaSection />
      <Footer />
    </div>
  );

  return renderLanding();
};

export default LandingPage;
