<script setup>
import AppHeader from '@/components/layout/AppHeader.vue';
import AppFooter from '@/components/layout/AppFooter.vue';
import HeroSection from '@/components/home/HeroSection.vue';
import SituationFilter from '@/components/home/SituationFilter.vue';
import TodayPicks from '@/components/home/TodayPicks.vue';
import CategoryGrid from '@/components/home/CategoryGrid.vue';
import NearbyMap from '@/components/home/NearbyMap.vue';
import PersonalRecommend from '@/components/home/PersonalRecommend.vue';
import RecentReviews from '@/components/home/RecentReviews.vue';
</script>

<template>
  <AppHeader active-menu="home" />

  <main class="container">
    <HeroSection />
    <SituationFilter />
    <TodayPicks />
    <CategoryGrid />

    <div class="two-col">
      <NearbyMap />
      <PersonalRecommend user-name="지훈" />
    </div>

    <RecentReviews />
  </main>

  <AppFooter />
</template>
