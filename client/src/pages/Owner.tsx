import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { useForm } from "react-hook-form";
import { CheckCircle2 } from "lucide-react";

type FormData = {
  name: string;
  phone: string;
  email: string;
  message: string;
};

export default function Owner() {
  const { register, handleSubmit, reset } = useForm<FormData>({
    defaultValues: {
      name: "",
      phone: "",
      email: "",
      message: "Olá, tenho um imóvel para anunciar e gostaria de mais informações.",
    },
  });

  const onSubmit = (data: FormData) => {
    const whatsappMessage = encodeURIComponent(
      `📢 *Solicitação de Contato – Proprietário*\n\n` +
      `👤 Nome: ${data.name}\n` +
      `📞 Telefone: ${data.phone}\n` +
      `📧 Email: ${data.email || "Não informado"}\n\n` +
      `📝 Mensagem:\n${data.message}`
    );

    const whatsappNumber = "5574999695633"; // SEU WHATSAPP
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`;

    window.open(whatsappUrl, "_blank");
    reset();
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />

      {/* Hero */}
      <div className="bg-primary text-primary-foreground py-16 md:py-24">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Anuncie seu Imóvel
          </h1>
          <p className="text-xl opacity-90 max-w-2xl mx-auto">
            Venda ou alugue com rapidez e segurança. Nós cuidamos de tudo para você.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 -mt-10 mb-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl mx-auto">

          {/* Benefícios */}
          <Card className="bg-white shadow-xl border-none">
            <CardHeader>
              <CardTitle className="text-2xl text-primary">
                Por que anunciar conosco?
              </CardTitle>
              <CardDescription>
                Vantagens exclusivas para proprietários
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              {[
                "Avaliação justa de mercado",
                "Divulgação em portais e redes sociais",
                "Atendimento personalizado",
                "Agilidade na venda ou locação",
                "Segurança em todo o processo",
              ].map((item, idx) => (
                <div key={idx} className="flex items-center">
                  <div className="bg-primary/10 p-2 rounded-full mr-4">
                    <CheckCircle2 className="h-5 w-5 text-primary" />
                  </div>
                  <span className="text-foreground font-medium">{item}</span>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Formulário */}
          <Card className="bg-white shadow-xl border-none">
            <CardHeader>
              <CardTitle className="text-2xl">
                Solicitar Contato
              </CardTitle>
              <CardDescription>
                Preencha os dados e fale direto conosco pelo WhatsApp
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <Input
                  placeholder="Nome completo"
                  {...register("name", { required: true })}
                />

                <Input
                  placeholder="Telefone / WhatsApp"
                  {...register("phone", { required: true })}
                />

                <Input
                  placeholder="E-mail (opcional)"
                  {...register("email")}
                />

                <Textarea
                  rows={4}
                  {...register("message")}
                />

                <Button
                  type="submit"
                  className="w-full h-12 text-lg font-bold bg-[#25D366] hover:bg-[#128C7E] text-white"
                >
                  Enviar pelo WhatsApp
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>

      <Footer />
    </div>
  );
}
