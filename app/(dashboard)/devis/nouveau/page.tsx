import DevisForm from "@/components/devis/DevisForm";

export default function NouveauDevisPage() {
  return (
    <div className="max-w-lg">
      <div className="mb-6">
        <h1 className="text-xl font-bold text-gray-900">Nouveau devis</h1>
        <p className="text-sm text-gray-500 mt-0.5">
          Les relances se déclencheront automatiquement à J+2, J+5 et J+10.
        </p>
      </div>
      <DevisForm />
    </div>
  );
}
