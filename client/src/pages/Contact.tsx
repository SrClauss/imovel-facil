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
  email?: string;
  message: string;
};

export default function Contact() {
  const { register, handleSubmit, reset } = useForm<FormData>({
    defaultValues: {
      name: "",
      phone: "",
      email: "",
      message: "Olá, gostaria de mais informações.",
    },
  });

  const onSubmit = (data: FormData) => {
    if (!data.name || !data.phone) {
      alert("Por favor, preencha nome e telefone.");
      return;
    }

    const whatsappMessage = encodeURIComponent(
      `📩 *Contato pelo Site*\n\n` +
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
            Fale Conosco
          </h1>
          <p className="text-xl opacity-90 max-w-2xl mx-auto">
            Entre em contato e tire suas dúvidas. Respondemos rapidamente pelo WhatsApp.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 -mt-10 mb-20">
        <div className="max-w-3xl mx-auto">
          <Card className="bg-white shadow-xl border-none">
            <CardHeader>
              <CardTitle className="text-2xl">
                Enviar Mensagem
              </CardTitle>
              <CardDescription>
                Preencha os dados abaixo para falar diretamente conosco
              </CardDescription>
            </CardHeader>

            <CardContent>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <Input
                  placeholder="Nome completo *"
                  {...register("name", { required: true })}
                />

                <Input
                  placeholder="Telefone / WhatsApp *"
                  {...register("phone", { required: true })}
                />

                <Input
                  placeholder="E-mail (opcional)"
                  {...register("email")}
                />

                <Textarea
                  rows={4}
                  placeholder="Digite sua mensagem"
                  {...register("message")}
                />

                <Button
                  type="submit"
                  className="w-full h-12 text-lg font-bold bg-[#25D366] hover:bg-[#128C7E] text-white"
                >
                  Enviar Mensagem pelo WhatsApp
                </Button>
              </form>

              <div className="mt-6 flex items-center text-sm text-muted-foreground">
                <CheckCircle2 className="h-4 w-4 text-green-500 mr-2" />
                Atendimento rápido e sem compromisso
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Footer />
    </div>
  );
}
