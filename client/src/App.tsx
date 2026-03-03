import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import FamilyPage from "./pages/FamilyPage";
import CatXiaoyu from "./pages/cats/CatXiaoyu";
import CatXueqiu from "./pages/cats/CatXueqiu";
import CatMomo from "./pages/cats/CatMomo";
import CatTiaowen from "./pages/cats/CatTiaowen";
import CatBuding from "./pages/cats/CatBuding";
import CatHuahua from "./pages/cats/CatHuahua";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/family" component={FamilyPage} />
      <Route path="/cat/xiaoyu" component={CatXiaoyu} />
      <Route path="/cat/xueqiu" component={CatXueqiu} />
      <Route path="/cat/momo" component={CatMomo} />
      <Route path="/cat/tiaowen" component={CatTiaowen} />
      <Route path="/cat/buding" component={CatBuding} />
      <Route path="/cat/huahua" component={CatHuahua} />
      <Route path="/404" component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
