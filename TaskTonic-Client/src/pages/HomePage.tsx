import { Link } from "react-router";
import { ArrowRight, Zap, Shield, TrendingUp, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function HomePage() {
  const features = [
    {
      icon: <Zap className="h-8 w-8" style={{ color: "#4871dc" }} />,
      title: "Lightning Fast",
      description: "Experience blazing fast performance with our optimized solutions built for speed."
    },
    {
      icon: <Shield className="h-8 w-8" style={{ color: "#4bb36b" }} />,
      title: "Secure & Reliable",
      description: "Your data is protected with enterprise-grade security and 99.9% uptime guarantee."
    },
    {
      icon: <TrendingUp className="h-8 w-8" style={{ color: "#4871dc" }} />,
      title: "Scalable Growth",
      description: "Scale effortlessly as your business grows with our flexible infrastructure."
    }
  ];

  const benefits = [
    "24/7 Customer Support",
    "Easy Integration",
    "Regular Updates",
    "Cost Effective",
    "Expert Team",
    "Proven Results"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 md:py-32">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Innovative Solutions for{" "}
            <span style={{ color: "#4871dc" }}>Your Success</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Transform your business with cutting-edge technology and expert solutions. 
            We help companies achieve their goals faster and more efficiently.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              asChild 
              size="lg"
              className="text-white hover:opacity-90 transition-opacity"
              style={{ backgroundColor: "#4871dc" }}
            >
              <Link to="/about" className="flex items-center gap-2">
                Get Started
                <ArrowRight className="h-5 w-5" />
              </Link>
            </Button>
            <Button 
              asChild 
              size="lg"
              variant="outline"
              className="border-2 hover:bg-gray-50"
              style={{ borderColor: "#4bb36b", color: "#4bb36b" }}
            >
              <Link to="/about">
                Learn More
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Why Choose Us
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            We deliver exceptional value through innovation, reliability, and dedicated support.
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {features.map((feature, index) => (
            <div 
              key={index}
              className="bg-white p-8 rounded-lg shadow-lg hover:shadow-xl transition-shadow border border-gray-100"
            >
              <div className="mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                {feature.title}
              </h3>
              <p className="text-gray-600">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20" style={{ backgroundColor: "#f8f9ff" }}>
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-12 text-center">
              Everything You Need to Succeed
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              {benefits.map((benefit, index) => (
                <div key={index} className="flex items-center gap-3">
                  <CheckCircle 
                    className="h-6 w-6 flex-shrink-0" 
                    style={{ color: "#4bb36b" }}
                  />
                  <span className="text-lg text-gray-700">{benefit}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20">
        <div 
          className="max-w-4xl mx-auto rounded-2xl p-12 text-center text-white"
          style={{ backgroundColor: "#4871dc" }}
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of satisfied customers who trust TasTonic.
          </p>
          <Button 
            asChild
            size="lg"
            className="bg-white hover:bg-gray-100 transition-colors"
            style={{ color: "#4871dc" }}
          >
            <Link to="/login" className="flex items-center gap-2">
              Start Your Journey
              <ArrowRight className="h-5 w-5" />
            </Link>
          </Button>
        </div>
      </section>
    </div>
  );
}