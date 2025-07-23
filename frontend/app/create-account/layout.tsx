import Nav from '@/components/onboarding/Nav'

export default function layout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <main className="w-full lg:px-[50px] md:px-6 px-4 md:py-[50px] py-4 overflow-x-hidden h-screen bg-theme">
      <Nav />
      <section className="max-w-2xl mx-auto md:mt-10 mt-10">
        <div className="w-full flex flex-col items-center gap-6">
          {children}
        </div>
      </section>
    </main>
  )
}
