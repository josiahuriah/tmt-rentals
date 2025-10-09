import { Button } from "@/components/ui/button"
import { Phone, Mail, Calendar } from "lucide-react"
import Link from "next/link"

export function CTASection() {
  return (
    <section className="py-20 bg-gradient-to-br from-black to-gray-900 text-white relative overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-brand-gold-500 rounded-full opacity-10 blur-3xl" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-brand-gold-500 rounded-full opacity-10 blur-3xl" />

      <div className="container relative z-10">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <h2 className="text-4xl md:text-5xl font-bold">
            Ready to Start Your{" "}
            <span className="text-brand-gold-500">Island Adventure?</span>
          </h2>
          <p className="text-xl text-gray-300">
            Whether you're here for business or pleasure, we have the perfect
            vehicle waiting for you. Book online or give us a call!
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Button
              asChild
              size="lg"
              className="bg-brand-gold-500 hover:bg-brand-gold-600 text-black font-semibold text-lg px-8"
            >
              <Link href="/rental">
                <Calendar className="mr-2 h-5 w-5" />
                Book a Rental
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-2 border-brand-gold-500 text-brand-gold-500 hover:bg-brand-gold-500 hover:text-black font-semibold text-lg px-8"
            >
              <Link href="/contact">
                <Mail className="mr-2 h-5 w-5" />
                Contact Us
              </Link>
            </Button>
          </div>

          {/* Contact Info */}
          <div className="pt-8 border-t border-gray-700">
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 text-gray-300">
              
                href="tel:+12424720016"
                className="flex items-center gap-2 hover:text-brand-gold-500 transition-colors"
              <a>
                <Phone className="w-5 h-5" />
                <span>+1 (242) 472-0016</span>
              </a>
              <span className="hidden sm:block">•</span>
              
                href="tel:+12423670942"
                className="flex items-center gap-2 hover:text-brand-gold-500 transition-colors"
              <a>
                <Phone className="w-5 h-5" />
                <span>+1 (242) 367-0942</span>
              </a>
              <span className="hidden sm:block">•</span>
              
                href="mailto:info@tmtsbahamas.com"
                className="flex items-center gap-2 hover:text-brand-gold-500 transition-colors"
              <a>
                <Mail className="w-5 h-5" />
                <span>info@tmtsbahamas.com</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}