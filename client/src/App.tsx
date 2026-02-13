import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from
  "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import PropertyDetails from "@/pages/PropertyDetails";
import Owner from "@/pages/Owner";
import Dashboard from "@/pages/Dashboard";
import Contact from "@/pages/Contact";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/imovel/:id" component={PropertyDetails} />
      <Route path="/proprietario" component={Owner} />
      <Route path="/dashboard" component={Dashboard} />
      <Route path="/contato" component={Contact} />
      <Route component={NotFound} />
    </Switch>
   
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Router />
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
