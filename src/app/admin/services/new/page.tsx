import ServiceForm from "@/components/admin/ServiceForm";

export default function NewServicePage() {
  return (
    <div className="mx-auto max-w-3xl px-5 sm:px-8 py-10">
      <h1 className="font-display text-2xl text-burgundy font-semibold mb-8">
        Add Service
      </h1>
      <ServiceForm />
    </div>
  );
}