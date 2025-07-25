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
          <span className="text-xl font-bold font-headline">TareaColab</span>
        </Link>
        <nav className="flex items-center gap-4">
          <Button variant="ghost" asChild>
            <Link href="/login">Iniciar Sesión</Link>
          </Button>
          <Button asChild>
            <Link href="/signup">Empezar Gratis</Link>
          </Button>
        </nav>
      </header>

      <main className="flex-grow">
        <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-headline tracking-tighter">
                Optimiza el Flujo de Trabajo de tu Equipo
              </h1>
              <p className="text-lg text-muted-foreground">
                TareaColab ayuda a tu equipo a mantenerse organizado, enfocado y al día. Crea proyectos, gestiona tareas y comunícate eficazmente, todo en un solo lugar.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" asChild>
                  <Link href="/signup">Regístrate Gratis</Link>
                </Button>
                <Button size="lg" variant="outline">
                  Saber Más
                </Button>
              </div>
            </div>
            <div>
              <Image
                src="https://placehold.co/600x400.png"
                alt="Panel de TareaColab"
                width={600}
                height={400}
                className="rounded-xl shadow-2xl"
                data-ai-hint="panel colaboración equipo"
              />
            </div>
          </div>
        </section>

        <section id="features" className="bg-card py-20 md:py-28">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center space-y-4 mb-12">
              <h2 className="text-3xl md:text-4xl font-bold font-headline">Funciones Diseñadas para la Productividad</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Todo lo que necesitas para avanzar en tu trabajo, más rápido.
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              <Card className="text-center">
                <CardHeader>
                  <div className="mx-auto bg-primary/10 text-primary p-3 rounded-full w-fit">
                    <Users className="h-8 w-8" />
                  </div>
                  <CardTitle className="font-headline pt-4">Gestión de Grupos y Proyectos</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">Crea fácilmente grupos y proyectos para organizar los flujos de trabajo de tu equipo y mantener todo en contexto.</p>
                </CardContent>
              </Card>
              <Card className="text-center">
                <CardHeader>
                  <div className="mx-auto bg-primary/10 text-primary p-3 rounded-full w-fit">
                    <CheckCircle2 className="h-8 w-8" />
                  </div>
                  <CardTitle className="font-headline pt-4">Listas de Tareas Compartidas</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">Mantén a todos alineados con listas de tareas compartidas, fechas de entrega y seguimiento del progreso en tiempo real.</p>
                </CardContent>
              </Card>
              <Card className="text-center">
                <CardHeader>
                  <div className="mx-auto bg-primary/10 text-primary p-3 rounded-full w-fit">
                    <MessageSquareQuote className="h-8 w-8" />
                  </div>
                  <CardTitle className="font-headline pt-4">Comunicación con IA</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">Obtén sugerencias para evitar malentendidos en tus mensajes, fomentando una comunicación más clara.</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-muted">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 flex items-center justify-between">
          <p className="text-muted-foreground text-sm">&copy; {new Date().getFullYear()} TareaColab. Todos los derechos reservados.</p>
          <div className="flex items-center gap-2">
            <Icons.logo className="h-6 w-6 text-muted-foreground" />
            <span className="font-bold">TareaColab</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
