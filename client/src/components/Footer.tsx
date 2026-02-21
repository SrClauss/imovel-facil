import { Link } from "wouter";
import { Facebook, Instagram, Twitter, Mail, Phone, MapPin } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-200 mt-auto">
      <div className="container mx-auto px-4 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="bg-primary p-1.5 rounded-lg">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
              </div>
              <span className="font-display text-xl font-bold text-white">Imóvel Fácil</span>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed max-w-xs">
              Sua plataforma de confiança para encontrar o imóvel dos seus sonhos em Juazeiro e região. Venda, aluguel e administração com excelência.
            </p>
            <div className="flex gap-4 pt-2">
              <a href="#" className="hover:text-primary transition-colors"><Facebook className="h-5 w-5" /></a>
              <a href="#" className="hover:text-primary transition-colors"><Instagram className="h-5 w-5" /></a>
              <a href="#" className="hover:text-primary transition-colors"><Twitter className="h-5 w-5" /></a>
            </div>
          </div>

          {/* Links */}
          <div>
            <h3 className="font-display font-semibold text-white mb-4">Navegação</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/" className="hover:text-primary transition-colors">Início</Link></li>
              <li><Link href="/proprietario" className="hover:text-primary transition-colors">Anunciar Imóvel</Link></li>
              <li><Link href="/contato" className="hover:text-primary transition-colors">Fale Conosco</Link></li>
              <li><Link href="/dashboard" className="hover:text-primary transition-colors">Área do Corretor</Link></li>
            </ul>
          </div>

          {/* Properties */}
          <div>
            <h3 className="font-display font-semibold text-white mb-4">Imóveis</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="/?type=sale" className="hover:text-primary transition-colors">Comprar</a></li>
              <li><a href="/?type=rent" className="hover:text-primary transition-colors">Alugar</a></li>
              <li><a href="/?category=house" className="hover:text-primary transition-colors">Casas</a></li>
              <li><a href="/?category=apartment" className="hover:text-primary transition-colors">Apartamentos</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-display font-semibold text-white mb-4">Contato</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-primary shrink-0" />
                <span>Rua das Palmeiras, 208, Centen�rio, Juazeiro - BA</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-primary shrink-0" />
                <span>(74) 99969-5633</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-primary shrink-0" />
                <span>lspinolagoncalves@gmail.com</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-slate-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-slate-500">
          <p>© 2024 Imóvel Fácil Juazeiro. Todos os direitos reservados.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-slate-300">Termos de Uso</a>
            <a href="#" className="hover:text-slate-300">Privacidade</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
