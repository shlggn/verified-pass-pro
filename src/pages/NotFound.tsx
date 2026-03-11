import { Link, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { ArrowLeft, Home } from "lucide-react";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-6">
      <div className="text-center space-y-4">
        <h1 className="text-6xl font-serif font-bold text-foreground">404</h1>
        <p className="text-lg text-muted-foreground">This page doesn't exist</p>
        <div className="flex items-center justify-center gap-3 pt-2">
          <Button variant="outline" size="sm" asChild className="rounded-xl gap-2">
            <Link to="/"><Home className="w-3.5 h-3.5" /> Home</Link>
          </Button>
          <Button size="sm" asChild className="rounded-xl gap-2">
            <Link to="/dashboard"><ArrowLeft className="w-3.5 h-3.5" /> Dashboard</Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
