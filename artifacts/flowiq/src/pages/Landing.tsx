import { Link } from "wouter";
import { GitBranch, BrainCircuit, BarChart3, Shield, Zap, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function Landing() {
  return (
    <div className="min-h-dvh bg-background text-foreground">
      {/* Nav */}
      <nav className="fixed top-0 inset-x-0 z-50 border-b bg-background/95 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 bg-primary text-primary-foreground rounded-lg flex items-center justify-center">
              <GitBranch className="h-4 w-4" />
            </div>
            <span className="font-bold text-lg">FlowIQ</span>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/login">
              <Button variant="ghost" size="sm">Sign In</Button>
            </Link>
            <Link href="/login">
              <Button size="sm">Get Started</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-24 px-4 text-center max-w-4xl mx-auto">
        <Badge variant="outline" className="mb-6 gap-2 px-3 py-1 border-primary/30 text-primary bg-primary/5">
          <BrainCircuit className="h-3.5 w-3.5" />
          AI-Powered Enterprise Workflows
        </Badge>
        <h1 className="text-5xl sm:text-6xl font-extrabold tracking-tight mb-6 leading-tight">
          Intelligent Workflow<br />
          <span className="text-primary">Management Platform</span>
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
          Automate, optimize, and predict your business workflows with enterprise-grade AI. Built for teams that demand clarity and speed.
        </p>
        <div className="flex gap-4 justify-center flex-wrap">
          <Link href="/sign-up">
            <Button size="lg" className="px-8 shadow-lg shadow-primary/20">Start Free Trial</Button>
          </Link>
          <Link href="/sign-in">
            <Button size="lg" variant="outline" className="px-8">Sign In</Button>
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-4 bg-muted/30 border-y">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Everything your enterprise needs</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: BrainCircuit, title: "AI Intelligence", desc: "Predict delays, classify requests, and optimize workflows automatically." },
              { icon: BarChart3, title: "Advanced Analytics", desc: "Real-time dashboards and performance reports for every department." },
              { icon: Shield, title: "Enterprise Security", desc: "Role-based access control and audit trails for compliance." },
              { icon: Zap, title: "Automation", desc: "SLA monitoring, escalation rules, and automated notifications." },
              { icon: Users, title: "Team Management", desc: "Manage departments, assign workloads, and track employee performance." },
              { icon: GitBranch, title: "Workflow Builder", desc: "Design multi-step approval flows with drag-and-drop simplicity." },
            ].map((feature) => (
              <div key={feature.title} className="bg-card rounded-xl border p-6 hover:border-primary/40 hover:shadow-md transition-all">
                <div className="h-10 w-10 bg-primary/10 text-primary rounded-lg flex items-center justify-center mb-4">
                  <feature.icon className="h-5 w-5" />
                </div>
                <h3 className="font-semibold text-base mb-2">{feature.title}</h3>
                <p className="text-muted-foreground text-sm">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl font-bold mb-4">Ready to get started?</h2>
          <p className="text-muted-foreground mb-8">Join enterprise teams that trust FlowIQ to manage their most critical workflows.</p>
          <Link href="/sign-up">
            <Button size="lg" className="px-10 shadow-lg shadow-primary/20">Get Started Free</Button>
          </Link>
        </div>
      </section>

      <footer className="border-t py-8 px-4 text-center text-sm text-muted-foreground">
        <p>© 2026 FlowIQ Enterprise. All rights reserved.</p>
      </footer>
    </div>
  );
}
