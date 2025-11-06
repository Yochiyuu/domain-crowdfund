import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Github,
  Gitlab,
  Layers,
  MoveRight,
  Rocket,
  ShieldCheck,
  Target,
  Twitter,
  Zap,
} from "lucide-react";
import Image from "next/image"; // Import komponen Image dari Next.js
import Link from "next/link";

// Definisikan partner/teknologi di sini agar mudah di-map
const techPartners = [
  // Tambahkan logoSrc untuk setiap partner
  { name: "Lisk", id: "lisk", logoSrc: "/logos/lisk.svg"},
  { name: "Sepolia", id: "sepolia", logoSrc: "/logos/sepolia.svg" },
  { name: "Ethereum", id: "eth", logoSrc: "/logos/ethereum.svg" },
  { name: "Solidity", id: "solidity", logoSrc: "/logos/solidity.svg" },
  { name: "Next.js", id: "nextjs", logoSrc: "/logos/nextjs.svg" },
  { name: "Vercel", id: "vercel", logoSrc: "/logos/vercel.svg" },
  { name: "Thirdweb", id: "thirdweb", logoSrc: "/logos/thirdweb.svg" },
];

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1 flex flex-col">
        {/* Hero Section (Dengan Latar Belakang Aurora Halus) */}
        <section className="w-full min-h-screen flex items-center py-20 relative overflow-hidden">
          {/* Efek Aurora Background (Opacity disesuaikan untuk tema terang) */}
          <div className="absolute inset-0 -z-10 opacity-70">
            {/* Gradien ungu/biru */}
            <div className="absolute left-[10%] top-[10%] h-[400px] w-[400px] rounded-full bg-gradient-radial from-primary/10 to-transparent blur-[128px] animate-aurora" />
            {/* Gradien pink/magenta */}
            <div
              className="absolute right-[10%] bottom-[5%] h-[400px] w-[400px] rounded-full bg-gradient-radial from-accent/10 to-transparent blur-[128px] animate-aurora"
              style={{ animationDelay: "10s" }}
            />
          </div>

          <div className="container px-4 md:px-6 mx-auto">
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 xl:gap-24 items-center">
              <div className="flex flex-col justify-center space-y-6 animate-slide-in-up">
                <div className="space-y-4">
                  <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl xl:text-7xl/none text-foreground">
                    Donasi Taman Indonesia.
                  </h1>
                  <p className="max-w-[600px] text-muted-foreground md:text-xl">
                    Selamat datang di Domain, platform crowdfunding transparan
                    yang dibangun di atas Lisk Blockchain. Wujudkan ide Anda
                    atau dukung inovator berikutnya.
                  </p>
                </div>
                <div className="flex flex-col gap-3 sm:flex-row">
                  <Button
                    size="lg"
                    asChild
                    className="shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-shadow"
                  >
                    <Link href="/crowdfund">
                      <Rocket className="mr-2 h-5 w-5" />
                      Mulai Jelajahi
                    </Link>
                  </Button>
                  <Button size="lg" variant="outline" asChild>
                    <Link href="#features" className="group">
                      Pelajari Fitur
                      <MoveRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                    </Link>
                  </Button>
                </div>
              </div>
              <div
                className="flex justify-center animate-slide-in-up"
                style={{ animationDelay: "0.2s" }}
              >
                <Layers className="w-48 h-48 lg:w-72 lg:h-72 text-primary animate-float" />
              </div>
            </div>
          </div>
        </section>

        {/* Features Section (Kartu Putih Bersih) */}
        <section id="features" className="w-full py-16 md:py-24 bg-muted/50">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
              <div className="inline-block rounded-lg bg-primary/20 px-3 py-1 text-sm font-medium text-primary">
                Fitur Unggulan
              </div>
              <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
                Mengapa Memilih Domain?
              </h2>
              <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Kami memanfaatkan kekuatan Lisk untuk menyediakan platform yang
                adil, transparan, dan efisien untuk penggalangan dana.
              </p>
            </div>

            <div className="mx-auto grid max-w-5xl items-start gap-8 sm:grid-cols-2 md:gap-12 lg:grid-cols-3">
              {/* Kartu 1 (Putih Bersih) */}
              <Card className="bg-card shadow-sm hover:shadow-lg transition-shadow">
                <CardContent className="pt-6 text-center sm:text-left">
                  <div className="mb-4 flex justify-center sm:justify-start">
                    <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
                      <ShieldCheck className="h-8 w-8 text-primary" />
                    </div>
                  </div>
                  <h3 className="mb-2 text-xl font-bold">Transparan & Aman</h3>
                  <p className="text-muted-foreground">
                    Setiap pendanaan dicatat di blockchain. Kontrak pintar
                    mengelola dana, memastikan dana hanya cair saat target
                    tercapai.
                  </p>
                </CardContent>
              </Card>
              {/* Kartu 2 (Putih Bersih) */}
              <Card className="bg-card shadow-sm hover:shadow-lg transition-shadow">
                <CardContent className="pt-6 text-center sm:text-left">
                  <div className="mb-4 flex justify-center sm:justify-start">
                    <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
                      <Zap className="h-8 w-8 text-primary" />
                    </div>
                  </div>
                  <h3 className="mb-2 text-xl font-bold">Biaya Rendah</h3>
                  <p className="text-muted-foreground">
                    Dibangun di atas Lisk, kami menawarkan biaya transaksi yang
                    jauh lebih rendah dibandingkan platform tradisional.
                  </p>
                </CardContent>
              </Card>
              {/* Kartu 3 (Putih Bersih) */}
              <Card className="bg-card shadow-sm hover:shadow-lg transition-shadow">
                <CardContent className="pt-6 text-center sm:text-left">
                  <div className="mb-4 flex justify-center sm:justify-start">
                    <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
                      <Target className="h-8 w-8 text-primary" />
                    </div>
                  </div>
                  <h3 className="mb-2 text-xl font-bold">Pendanaan Global</h3>
                  <p className="text-muted-foreground">
                    Akses pool pendana global tanpa batasan perbankan
                    tradisional. Siapapun, dimanapun, dapat berpartisipasi.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Slider Teknologi */}
        <section
          id="tech-slider"
          className="w-full py-16 md:py-24 bg-background"
        >
          <div className="container px-4 md:px-6 mx-auto">
            <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl text-muted-foreground">
                Didukung oleh Teknologi Terkini
              </h2>
            </div>

            <div
              className="relative flex overflow-hidden"
              style={{
                maskImage:
                  "linear-gradient(to right, transparent 0%, black 10%, black 90%, transparent 100%)",
              }}
            >
              <div className="flex w-max animate-marquee-infinite">
                {techPartners.map((partner) => (
                  <div key={partner.id} className="mx-10 flex-shrink-0">
                    {/* Mengganti h2 dengan komponen Image dari Next.js */}
                    <Image
                      src={partner.logoSrc}
                      alt={`${partner.name} Logo`}
                      width={100} // <-- Diseragamkan
                      height={32} // <-- Disesuaikan dengan h-8
                      className="h-8 w-auto object-contain transition-all duration-300 hover:scale-105" // <-- DIUBAH DARI h-10
                    />
                  </div>
                ))}
                {/* Duplikasi untuk efek marquee yang mulus */}
                {techPartners.map((partner) => (
                  <div
                    key={`${partner.id}-dup`}
                    className="mx-10 flex-shrink-0"
                    aria-hidden="true"
                  >
                    <Image
                      src={partner.logoSrc}
                      alt={`${partner.name} Logo`}
                      width={100} // <-- Diseragamkan
                      height={32} // <-- Disesuaikan dengan h-8
                      className="h-8 w-auto object-contain transition-all duration-300 hover:scale-105" // <-- DIUBAH DARI h-10
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* About Section */}
        <section id="about" className="w-full py-16 md:py-24 bg-muted/50">
          <div className="container grid items-center gap-10 px-4 md:px-6 lg:grid-cols-2 lg:gap-16 mx-auto">
            <div className="space-y-4">
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">
                Tentang Domain
              </h2>
              <p className="max-w-[600px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Domain adalah bukti konsep (PoC) yang menunjukkan bagaimana
                aplikasi crowdfunding dapat dibangun di atas jaringan Lisk.
                Proyek ini mendemonstrasikan penggunaan kontrak pintar untuk
                mengelola kampanye pendanaan, kontribusi, dan pencairan dana
                secara otomatis dan aman.
              </p>
              <p className="max-w-[600px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Tujuan kami adalah memberdayakan kreator dengan memberi mereka
                alat untuk mengumpulkan dana tanpa perantara yang mahal.
              </p>
            </div>

            {/* Kartu CTA dengan Border Gradien (Aksen baru) */}
            <div className="flex justify-center">
              <div className="w-full max-w-md rounded-xl bg-gradient-to-br from-primary via-accent to-primary/50 p-1 transition-all hover:shadow-lg hover:shadow-primary/20">
                <Card className="w-full bg-card">
                  <CardHeader>
                    <CardTitle>Mulai Sekarang</CardTitle>
                    <CardDescription>
                      Siap untuk memulai perjalanan Anda?
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="grid gap-4">
                    <Button size="lg" asChild>
                      <Link href="/crowdfund">Jelajahi Proyek</Link>
                    </Button>
                    <p className="text-xs text-center text-muted-foreground">
                      Atau buat proyek Anda sendiri (setelah terhubung).
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer (Dengan Latar Belakang Baru) */}
      <footer className="w-full bg-card border-t border-border py-12 md:py-16">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="col-span-2 md:col-span-1">
              <h3 className="text-2xl font-bold text-foreground">Domain</h3>
              <p className="text-sm text-muted-foreground mt-2 max-w-xs">
                Platform crowdfunding transparan di atas Lisk Blockchain.
              </p>
              <div className="flex gap-4 mt-6">
                <Link
                  href="#"
                  aria-label="Twitter"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  <Twitter className="w-6 h-6" />
                </Link>
                <Link
                  href="#"
                  aria-label="Github"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  <Github className="w-6 h-6" />
                </Link>
                <Link
                  href="#"
                  aria-label="Gitlab"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  <Gitlab className="w-6 h-6" />
                </Link>
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-foreground mb-4">Proyek</h4>
              <nav className="flex flex-col gap-3">
                <Link
                  href="/crowdfund"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  prefetch={false}
                >
                  Jelajahi Proyek
                </Link>
                <Link
                  href="/crowdfund"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  prefetch={false}
                >
                  Buat Proyek
                </Link>
                <Link
                  href="#"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  prefetch={false}
                >
                  Cara Kerja
                </Link>
              </nav>
            </div>

            <div>
              <h4 className="font-semibold text-foreground mb-4">Perusahaan</h4>
              <nav className="flex flex-col gap-3">
                <Link
                  href="#about"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  prefetch={false}
                >
                  Tentang Kami
                </Link>
                <Link
                  href="#features"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  prefetch={false}
                >
                  Fitur
                </Link>
              </nav>
            </div>

            <div>
              <h4 className="font-semibold text-foreground mb-4">Legal</h4>
              <nav className="flex flex-col gap-3">
                <Link
                  href="#"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  prefetch={false}
                >
                  Terms of Service
                </Link>
                <Link
                  href="#"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  prefetch={false}
                >
                  Privacy Policy
                </Link>
              </nav>
            </div>
          </div>

          <div className="border-t border-border mt-10 pt-8 text-center">
            <p className="text-xs text-muted-foreground">
              &copy; 2025 Domain. Dibangun di atas Lisk Sepolia.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
