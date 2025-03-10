import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-blue-50">
      <Header />
      
      <motion.section 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="py-24 text-center"
      >
        <div className="container max-w-6xl">
          <h1 className="text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
            AI-Powered Writing Assistant
          </h1>
          <p className="text-xl text-muted-foreground mb-8">
            Transform your writing with real-time AI suggestions and professional editing tools
          </p>
          <Button size="lg" asChild>
            <Link href="/editor">Start Writing →</Link>
          </Button>
        </div>
      </motion.section>

      <FeaturesSection />
      
      <Footer />
    </div>
  );
}

const FeaturesSection = () => (
  <section className="py-16 bg-white">
    <div className="container max-w-6xl grid md:grid-cols-3 gap-8">
      {FEATURES.map((feature, index) => (
        <motion.div
          key={feature.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <Card className="h-full hover:shadow-lg transition-shadow">
            <CardHeader>
              <feature.icon className="w-12 h-12 text-blue-600" />
            </CardHeader>
            <CardTitle>{feature.title}</CardTitle>
            <CardContent>{feature.description}</CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  </section>
);

const FEATURES = [
  {
    title: "AI Transformations",
    description: "Rewrite text with professional, casual, or creative styles",
    icon: MagicWandIcon,
  },
  // Add more features...
];