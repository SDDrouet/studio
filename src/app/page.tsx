import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle2, FolderKanban, MessageSquareQuote, Users } from 'lucide-react';
import { Icons } from '@/components/icons';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <header className="container mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <Icons.logo className="h-8 w-8 text-primary" />
          <span className="text-xl font-bold font-headline">CollabTask</span>
        </Link>
        <nav className="flex items-center gap-4">
          <Button variant="ghost" asChild>
            <Link href="/login">Log In</Link>
          </Button>
          <Button asChild>
            <Link href="/signup">Get Started</Link>
          </Button>
        </nav>
      </header>

      <main className="flex-grow">
        <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-headline tracking-tighter">
                Streamline Your Team's Workflow
              </h1>
              <p className="text-lg text-muted-foreground">
                CollabTask helps your team stay organized, focused, and on track. Create projects, manage tasks, and communicate effectively—all in one place.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" asChild>
                  <Link href="/signup">Sign Up for Free</Link>
                </Button>
                <Button size="lg" variant="outline">
                  Learn More
                </Button>
              </div>
            </div>
            <div>
              <Image
                src="https://placehold.co/600x400.png"
                alt="CollabTask Dashboard"
                width={600}
                height={400}
                className="rounded-xl shadow-2xl"
                data-ai-hint="team collaboration dashboard"
              />
            </div>
          </div>
        </section>

        <section id="features" className="bg-card py-20 md:py-28">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center space-y-4 mb-12">
              <h2 className="text-3xl md:text-4xl font-bold font-headline">Features Designed for Productivity</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Everything you need to move work forward, faster.
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              <Card className="text-center">
                <CardHeader>
                  <div className="mx-auto bg-primary/10 text-primary p-3 rounded-full w-fit">
                    <Users className="h-8 w-8" />
                  </div>
                  <CardTitle className="font-headline pt-4">Group & Project Management</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">Easily create groups and projects to organize your team's work streams and keep everything in context.</p>
                </CardContent>
              </Card>
              <Card className="text-center">
                <CardHeader>
                  <div className="mx-auto bg-primary/10 text-primary p-3 rounded-full w-fit">
                    <CheckCircle2 className="h-8 w-8" />
                  </div>
                  <CardTitle className="font-headline pt-4">Shared Task Lists</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">Keep everyone aligned with shared task lists, due dates, and real-time progress tracking.</p>
                </CardContent>
              </Card>
              <Card className="text-center">
                <CardHeader>
                  <div className="mx-auto bg-primary/10 text-primary p-3 rounded-full w-fit">
                    <MessageSquareQuote className="h-8 w-8" />
                  </div>
                  <CardTitle className="font-headline pt-4">AI-Powered Communication</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">Get suggestions to avoid misunderstandings in your messages, fostering clearer communication.</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-muted">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 flex items-center justify-between">
          <p className="text-muted-foreground text-sm">&copy; {new Date().getFullYear()} CollabTask. All rights reserved.</p>
          <div className="flex items-center gap-2">
            <Icons.logo className="h-6 w-6 text-muted-foreground" />
            <span className="font-bold">CollabTask</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
