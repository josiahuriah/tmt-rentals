import { HeroCarousel } from "@/components/customer/HeroCarousel"
import { AboutBanner } from "@/components/customer/AboutBanner"
import { CategoryCards } from "@/components/customer/CategoryCards"
import { CTASection } from "@/components/customer/CTASection"

export const dynamic = 'force-dynamic'

export default function HomePage() {
  return (
    <>
      <HeroCarousel />
      <AboutBanner />
      <CategoryCards />
      <CTASection />
    </>
  )
}