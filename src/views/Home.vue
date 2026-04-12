<template>
  <main>
    <HeroSection />
    <AboutSection />
    <CompanySection />
    <ServicesSection />
    <ProjectsSection :limit="6" :showViewAll="true" />
    <ProcessSection />
    <TeamSection />
    <TestimonialsSection />
    <CtaSection />
  </main>
</template>

<script setup>
import HeroSection from '../components/HeroSection.vue'
import AboutSection from '../components/AboutSection.vue'
import CompanySection from '../components/CompanySection.vue'
import ServicesSection from '../components/ServicesSection.vue'
import ProjectsSection from '../components/ProjectsSection.vue'
import ProcessSection from '../components/ProcessSection.vue'
import TeamSection from '../components/TeamSection.vue'
import TestimonialsSection from '../components/TestimonialsSection.vue'
import CtaSection from '../components/CtaSection.vue'
</script>
