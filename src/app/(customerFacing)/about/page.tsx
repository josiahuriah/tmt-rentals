import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import Image from "next/image"
import { 
  Car, 
  Shield, 
  Clock, 
  Award, 
  Users, 
  MapPin,
  Phone,
  CheckCircle
} from "lucide-react"

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <section className="bg-black text-white py-20">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="max-w-4xl mx-auto text-center space-y-6">
            <Badge className="bg-brand-red-500 text-white">
              Serving Long Island Since 2019
            </Badge>
            <h1 className="text-5xl md:text-6xl font-bold">
              Your Trusted Island Transportation Partner
            </h1>
            <p className="text-xl text-gray-300">
              At TMT's Coconut Cruisers, we're more than just a car rental service—
              we're your gateway to exploring the beauty of Long Island, Bahamas.
            </p>
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-20">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="relative">
              <div className="aspect-square rounded-2xl overflow-hidden bg-gray-200 relative">
                <Image
                  src="/logo.png"
                  alt="TMT's Coconut Cruisers"
                  fill
                  className="object-contain p-12"
                />
              </div>
              <div className="absolute -bottom-6 -right-6 w-40 h-40 bg-brand-red-500 rounded-full opacity-20 blur-3xl" />
            </div>

            <div className="space-y-6">
              <h2 className="text-4xl font-bold">Our Story</h2>
              <div className="space-y-4 text-muted-foreground">
                <p className="text-lg leading-relaxed">
                  Founded in 2019, TMT's Coconut Cruisers was born from a simple vision: 
                  to provide reliable, affordable, and high-quality car rental services 
                  to visitors and residents of Long Island, Bahamas.
                </p>
                <p className="text-lg leading-relaxed">
                  Located in the heart of Deadman's Cay, we understand the unique needs 
                  of island travelers. Whether you're here for business, a family vacation, 
                  or exploring our beautiful island, we have the perfect vehicle to make 
                  your journey comfortable and memorable.
                </p>
                <p className="text-lg leading-relaxed">
                  Our commitment to exceptional service, well-maintained vehicles, and 
                  competitive pricing has made us the go-to choice for car rentals on 
                  Long Island.
                </p>
              </div>
              <Button 
                asChild 
                size="lg"
                className="bg-brand-red-500 hover:bg-brand-red-600 text-white font-semibold"
              >
                <Link href="/rental">Book Your Vehicle Today</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="text-center mb-12 space-y-4">
            <h2 className="text-4xl font-bold">Why Choose Us</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              We're dedicated to providing the best car rental experience in the Bahamas
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="border-2 hover:border-brand-red-500 transition-all">
              <CardContent className="p-6 text-center space-y-4">
                <div className="w-16 h-16 mx-auto rounded-full bg-brand-red-500/10 flex items-center justify-center">
                  <Car className="w-8 h-8 text-brand-red-600" />
                </div>
                <h3 className="text-xl font-bold">Wide Selection</h3>
                <p className="text-muted-foreground">
                  From economy cars to luxury SUVs, we have vehicles for every need and budget
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-brand-red-500 transition-all">
              <CardContent className="p-6 text-center space-y-4">
                <div className="w-16 h-16 mx-auto rounded-full bg-brand-red-500/10 flex items-center justify-center">
                  <Shield className="w-8 h-8 text-brand-red-600" />
                </div>
                <h3 className="text-xl font-bold">Fully Insured</h3>
                <p className="text-muted-foreground">
                  All vehicles are comprehensively insured for your peace of mind
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-brand-red-500 transition-all">
              <CardContent className="p-6 text-center space-y-4">
                <div className="w-16 h-16 mx-auto rounded-full bg-brand-red-500/10 flex items-center justify-center">
                  <Clock className="w-8 h-8 text-brand-red-600" />
                </div>
                <h3 className="text-xl font-bold">Flexible Service</h3>
                <p className="text-muted-foreground">
                  Daily rentals with convenient pickup and drop-off options
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-brand-red-500 transition-all">
              <CardContent className="p-6 text-center space-y-4">
                <div className="w-16 h-16 mx-auto rounded-full bg-brand-red-500/10 flex items-center justify-center">
                  <Award className="w-8 h-8 text-brand-red-600" />
                </div>
                <h3 className="text-xl font-bold">Top-Rated Service</h3>
                <p className="text-muted-foreground">
                  Consistently rated 5 stars by our satisfied customers
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-white">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="text-center mb-12 space-y-4">
            <h2 className="text-4xl font-bold">Our Commitment to You</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              These core values guide everything we do
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="text-center space-y-4">
              <div className="w-20 h-20 mx-auto rounded-full bg-brand-red-500/10 flex items-center justify-center">
                <CheckCircle className="w-10 h-10 text-brand-red-600" />
              </div>
              <h3 className="text-2xl font-bold">Reliability</h3>
              <p className="text-muted-foreground">
                Well-maintained vehicles you can depend on for your entire journey
              </p>
            </div>

            <div className="text-center space-y-4">
              <div className="w-20 h-20 mx-auto rounded-full bg-brand-red-500/10 flex items-center justify-center">
                <Users className="w-10 h-10 text-brand-red-600" />
              </div>
              <h3 className="text-2xl font-bold">Customer First</h3>
              <p className="text-muted-foreground">
                Your satisfaction and safety are our top priorities
              </p>
            </div>

            <div className="text-center space-y-4">
              <div className="w-20 h-20 mx-auto rounded-full bg-brand-red-500/10 flex items-center justify-center">
                <MapPin className="w-10 h-10 text-brand-red-600" />
              </div>
              <h3 className="text-2xl font-bold">Local Expertise</h3>
              <p className="text-muted-foreground">
                Deep knowledge of Long Island to help you explore like a local
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-black text-white">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Our Track Record</h2>
            <p className="text-xl text-gray-300">
              Numbers that speak for themselves
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8 max-w-5xl mx-auto">
            <div className="text-center">
              <div className="text-5xl font-bold text-brand-red-500 mb-2">5+</div>
              <p className="text-gray-300">Years in Business</p>
            </div>
            <div className="text-center">
              <div className="text-5xl font-bold text-brand-red-500 mb-2">15+</div>
              <p className="text-gray-300">Vehicles Available</p>
            </div>
            <div className="text-center">
              <div className="text-5xl font-bold text-brand-red-500 mb-2">500+</div>
              <p className="text-gray-300">Happy Customers</p>
            </div>
            <div className="text-center">
              <div className="text-5xl font-bold text-brand-red-500 mb-2">5★</div>
              <p className="text-gray-300">Average Rating</p>
            </div>
          </div>
        </div>
      </section>

      {/* What We Offer */}
      <section className="py-20">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="text-center mb-12 space-y-4">
            <h2 className="text-4xl font-bold">What We Offer</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Everything you need for a smooth rental experience
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {[
              "Economy and luxury vehicle options",
              "Comprehensive insurance coverage",
              "Flexible rental periods (daily, weekly, monthly)",
              "Free vehicle delivery within Deadman's Cay",
              "24/7 roadside assistance",
              "No hidden fees - transparent pricing",
              "Well-maintained, clean vehicles",
              "Easy online booking system"
            ].map((feature, index) => (
              <div key={index} className="flex items-start gap-3">
                <CheckCircle className="w-6 h-6 text-brand-red-600 flex-shrink-0 mt-1" />
                <span className="text-lg">{feature}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Location & Contact */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-white">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="grid md:grid-cols-2 gap-12 max-w-5xl mx-auto">
            <Card>
              <CardContent className="p-8 space-y-4">
                <div className="w-16 h-16 rounded-full bg-brand-red-500/10 flex items-center justify-center mb-4">
                  <MapPin className="w-8 h-8 text-brand-red-600" />
                </div>
                <h3 className="text-2xl font-bold">Visit Us</h3>
                <div className="space-y-2 text-muted-foreground">
                  <p>Deadman's Cay</p>
                  <p>Long Island</p>
                  <p>Bahamas</p>
                </div>
                <div className="pt-4">
                  <p className="font-semibold mb-2">Business Hours:</p>
                  <p className="text-muted-foreground">Monday - Sunday</p>
                  <p className="text-muted-foreground">8:00 AM - 6:00 PM</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-8 space-y-4">
                <div className="w-16 h-16 rounded-full bg-brand-red-500/10 flex items-center justify-center mb-4">
                  <Phone className="w-8 h-8 text-brand-red-600" />
                </div>
                <h3 className="text-2xl font-bold">Get in Touch</h3>
                <div className="space-y-3">
                  <div>
                    <p className="font-semibold mb-1">Phone:</p>
                    <a 
                      href="tel:+12424720016" 
                      className="text-brand-red-600 hover:text-brand-red-700"
                    >
                      +1 (242) 472-0016
                    </a>
                    <br />
                    <a 
                      href="tel:+12423670942" 
                      className="text-brand-red-600 hover:text-brand-red-700"
                    >
                      +1 (242) 367-0942
                    </a>
                  </div>
                  <div>
                    <p className="font-semibold mb-1">Email:</p>
                    <a 
                      href="mailto:info@tmtsbahamas.com" 
                      className="text-brand-red-600 hover:text-brand-red-700"
                    >
                      info@tmtsbahamas.com
                    </a>
                  </div>
                </div>
                <Button 
                  asChild 
                  className="w-full bg-brand-red-500 hover:bg-brand-red-600 text-white mt-4"
                >
                  <Link href="/contact">Send Us a Message</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-black text-white">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="text-center space-y-6 max-w-3xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold">
              Ready to Explore Long Island?
            </h2>
            <p className="text-xl text-gray-300">
              Book your vehicle today and experience the freedom of island travel
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Button 
                asChild 
                size="lg"
                className="bg-brand-red-500 hover:bg-brand-red-600 text-white font-semibold text-lg px-8"
              >
                <Link href="/rental">Book Now</Link>
              </Button>
              <Button 
                asChild 
                size="lg"
                variant="outline"
                className="border-2 border-white text-white hover:bg-white hover:text-black font-semibold text-lg px-8"
              >
                <Link href="/contact">Contact Us</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}