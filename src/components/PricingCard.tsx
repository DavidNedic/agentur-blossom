import { Check } from "lucide-react";

interface PricingCardProps {
  number: string;
  title: string;
  subtitle: string;
  price: string;
  priceNote: string;
  features: string[];
  popular?: boolean;
}

export function PricingCard({ number, title, subtitle, price, priceNote, features, popular }: PricingCardProps) {
  return (
    <div className="relative rounded-xl border border-border bg-card p-6 flex flex-col h-full transition-transform hover:scale-[1.02] hover:border-primary/50">
      {popular && (
        <span className="absolute top-4 right-4 bg-highlight text-highlight-foreground text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
          Najpopularnije
        </span>
      )}
      <span className="text-primary font-bold text-sm">{number}</span>
      <h3 className="text-foreground font-bold text-xl mt-1">{title}</h3>
      <p className="text-muted-foreground text-sm mt-1">{subtitle}</p>
      <div className="mt-4 mb-4 border-b border-border pb-4">
        <span className="text-primary font-extrabold text-4xl">{price}</span>
        <p className="text-muted-foreground text-sm mt-1">{priceNote}</p>
      </div>
      <ul className="space-y-3 flex-1">
        {features.map((f, i) => (
          <li key={i} className="flex items-start gap-2 text-sm text-foreground">
            <Check className="w-4 h-4 text-primary mt-0.5 shrink-0" />
            <span>{f}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
