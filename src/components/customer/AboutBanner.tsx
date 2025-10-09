import { Button } from "@/components/ui/button"
import { Car, Shield, Clock, Award } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export function AboutBanner() {
  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 to-white">
      <div className="container">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Left: Image/Logo */}
          <div className="relative">
            <div className="aspect-square rounded-2xl overflow-hidden bg-black/5 flex items-center justify-center">
              <Image
                src="/logo.png"
                alt="TMT's Coconut Cruisers"
                width={400}
                height={400}
                className="object-contain p-8"
              />
            </div>
            {/* Decorative Element */}
            <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-brand-gold-500 rounded-full opacity-20 blur-3xl" />
          </div>

          {/* Right: Content */}
          <div className="space-y-6">
            <h2 className="text-4xl md:text-5xl font-bold">
              Your Island's Ultimate Stop for Car Rentals
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              At TMT's Coconut Cruisers, our mission is to provide hassle-free
              and exceptional car rental experiences. We offer a diverse
              selection of quality vehicles, combined with unparalleled customer
              service, ensuring seamless journeys and unforgettable adventures.
            </p>

            {/* Features Grid */}
            <div className="grid grid-cols-2 gap-4 pt-4">
              <div className="flex gap-3">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 rounded-lg bg-brand-gold-500/10 flex items-center justify-center">
                    <Car className="w-5 h-5 text-brand-gold-600" />
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold">Wide Selection</h3>
                  <p className="text-sm text-muted-foreground">
                    Economy to luxury vehicles
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 rounded-lg bg-brand-gold-500/10 flex items-center justify-center">
                    <Shield className="w-5 h-5 text-brand-gold-600" />
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold">Fully Insured</h3>
                  <p className="text-sm text-muted-foreground">
                    Drive with confidence
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 rounded-lg bg-brand-gold-500/10 flex items-center justify-center">
                    <Clock className="w-5 h-5 text-brand-gold-600" />
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold">Flexible Hours</h3>
                  <p className="text-sm text-muted-foreground">
                    8 AM - 6 PM daily
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 rounded-lg bg-brand-gold-500/10 flex items-center justify-center">
                    <Award className="w-5 h-5 text-brand-gold-600" />
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold">Top Rated</h3>
                  <p className="text-sm text-muted-foreground">
                    5-star service
                  </p>
                </div>
              </div>
            </div>

            <Button
              asChild
              size="lg"
              className="bg-black hover:bg-black/90 text-brand-gold-500 font-semibold"
            >
              <Link href="/rental">Book Your Vehicle</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}