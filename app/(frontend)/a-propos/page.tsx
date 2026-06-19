import { Target, Eye, Heart, Phone } from "lucide-react";

export default function AProposPage() {
  return (
    <div className="min-h-screen">
      <section className="relative text-white py-20 overflow-hidden">
        <div className="absolute inset-0">
          <img src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1600&q=80" alt="Plage tropicale" className="w-full h-full object-cover opacity-90" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Ã€ propos de CÃ”TIÃˆRE</h1>
          <p className="text-gray-100 text-lg max-w-2xl mx-auto">
            "Nous Croyons en la force des NTIC"
          </p>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="prose prose-lg max-w-none text-gray-600">
            <p className="text-xl text-[#0a1628] font-medium leading-relaxed mb-6">
              CÃ”TIÃˆRE MEDIA GROUP est un groupe multimÃ©dia diversifiÃ© opÃ©rant dans plusieurs
              secteurs clÃ©s de la communication gÃ©nÃ©rale et des prestations diverses.
            </p>
            <p className="leading-relaxed mb-6">
              Fort de sa conviction dans la puissance des Nouvelles Technologies de l'Information
              et de la Communication (NTIC), le groupe offre une gamme complÃ¨te de services
              innovants et professionnels sur le littoral ivoirien.
            </p>
            <p className="leading-relaxed">
              Sous la direction de M. HONORABLE BONIFACE LOBA, CÃ”TIÃˆRE MEDIA GROUP s'est imposÃ©
              comme le partenaire de rÃ©fÃ©rence pour la communication, le tourisme, la musique,
              la logistique Ã©vÃ©nementielle et les services administratifs dans la rÃ©gion.
            </p>
          </div>
        </div>
      </section>

      <section className="py-16 bg-[#f0f9ff]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="section-title text-center mb-12">Nos valeurs</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { icon: Target, title: "Mission", text: "Centraliser et digitaliser les services du littoral ivoirien pour les rendre accessibles Ã  tous, partout et Ã  tout moment." },
              { icon: Eye, title: "Vision", text: "Devenir le groupe multimÃ©dia de rÃ©fÃ©rence en CÃ´te d'Ivoire, reconnu pour la qualitÃ© et l'innovation de ses services." },
              { icon: Heart, title: "Engagement", text: "ProximitÃ© avec nos clients, rÃ©activitÃ©, professionnalisme et respect des dÃ©lais dans chacune de nos prestations." },
            ].map(({ icon: Icon, title, text }) => (
              <div key={title} className="bg-white rounded-xl p-6 shadow-sm text-center card-hover">
                <div className="w-14 h-14 bg-[#c9a84c]/10 text-[#c9a84c] rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Icon size={26} />
                </div>
                <h3 className="font-bold text-[#0a1628] text-lg mb-3">{title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="section-title mb-8">Nos avantages compÃ©titifs</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {[
              "Groupe multimÃ©dia intÃ©grÃ©",
              "Expertise locale du littoral",
              "Services multilingues (6 langues)",
              "Ã‰quipe professionnelle",
              "Ã‰quipements modernes",
              "RÃ©activitÃ© et proximitÃ©",
            ].map((a) => (
              <div key={a} className="bg-[#f8f4ed] rounded-lg p-4 text-sm font-medium text-[#0a1628]">
                âœ“ {a}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Ã‰quipe dirigeante */}
      <section className="py-16 bg-[#f0f9ff]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-[#c9a84c] text-sm font-semibold uppercase tracking-widest">Notre Ã©quipe</span>
            <h2 className="section-title mt-2">Les hommes derriÃ¨re CÃ”TIÃˆRE</h2>
          </div>
          <div className="flex flex-col md:flex-row gap-8 items-center justify-center">
            {/* Dirigeant principal */}
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 text-center max-w-sm w-full">
              <div className="w-32 h-32 rounded-full overflow-hidden mx-auto mb-4 border-4 border-[#c9a84c] shadow-md">
                <img src="/Images/photo-1.jpeg" alt="M. HONORABLE BONIFACE LOBA" className="w-full h-full object-cover object-top" />
              </div>
              <h3 className="font-bold text-[#0a1628] text-lg">M. HONORABLE BONIFACE LOBA</h3>
              <p className="text-[#c9a84c] font-semibold text-sm mt-1">Directeur GÃ©nÃ©ral</p>
              <p className="text-gray-500 text-sm mt-3 leading-relaxed">
                Fondateur et dirigeant de CÃ”TIÃˆRE MEDIA GROUP, M. LOBA porte la vision d'un groupe
                multimÃ©dia de rÃ©fÃ©rence sur le littoral ivoirien.
              </p>
              <div className="flex flex-col gap-2 mt-4">
                <a href="tel:+2250747722931" className="inline-flex items-center gap-1.5 text-sm text-[#0c4a6e] hover:text-[#c9a84c] transition-colors font-medium">
                  <Phone size={14} /> 07 47 72 29 31
                </a>
                <a href="tel:+2250586878920" className="inline-flex items-center gap-1.5 text-sm text-[#0c4a6e] hover:text-[#c9a84c] transition-colors font-medium">
                  <Phone size={14} /> 05 86 87 89 20
                </a>
                <a href="tel:+2250102171803" className="inline-flex items-center gap-1.5 text-sm text-[#0c4a6e] hover:text-[#c9a84c] transition-colors font-medium">
                  <Phone size={14} /> 01 02 17 18 03
                </a>
              </div>
            </div>

            {/* Ã‰quipe */}
            <div className="grid grid-cols-2 gap-4 max-w-sm w-full">
              {[
                { initials: "CM", role: "Direction Communication", color: "from-purple-500 to-purple-600" },
                { initials: "DT", role: "Direction Tourisme", color: "from-green-500 to-emerald-600" },
                { initials: "DM", role: "Direction Musicale", color: "from-pink-500 to-rose-600" },
                { initials: "DE", role: "Direction Ã‰vÃ©nements", color: "from-amber-500 to-orange-500" },
              ].map((m) => (
                <div key={m.role} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 text-center">
                  <div className={`w-12 h-12 bg-gradient-to-br ${m.color} rounded-full flex items-center justify-center mx-auto mb-2 text-white text-sm font-bold`}>
                    {m.initials}
                  </div>
                  <p className="text-xs font-semibold text-[#0a1628] leading-tight">{m.role}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA contact */}
      <section className="py-12 bg-[#0c4a6e] text-white">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <p className="text-xl font-bold mb-2">"Nous Croyons en la force des NTIC"</p>
          <p className="text-gray-300 text-sm mb-6">CÃ”TIÃˆRE MEDIA GROUP â€” Littoral Ivoirien</p>
          <a href="/contact" className="btn-primary inline-flex">Nous contacter</a>
        </div>
      </section>
    </div>
  );
}


